import React, { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import Popupyn from "../../components/Popupyn";
import "./Orders.css";

const statusOptionsDelivery = ["Poručeno", "Potvrđeno", "Poslato", "Završeno"];
const statusOptionsPickup = ["Poručeno", "Pripremljeno", "Preuzeto"];

const allStatusOptions = Array.from(
  new Set([...statusOptionsDelivery, ...statusOptionsPickup])
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filteri za pretragu
  const [searchOrderId, setSearchOrderId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDeliveryMethod, setFilterDeliveryMethod] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterPickupPharmacy, setFilterPickupPharmacy] = useState("");

  // State za popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState(null);

  const getFilterStatusOptions = () => {
    if (filterDeliveryMethod === "Preuzimanje u apoteci") {
      return statusOptionsPickup;
    } else if (filterDeliveryMethod === "Dostava na adresu") {
      return statusOptionsDelivery;
    } else {
      return allStatusOptions;
    }
  };

  // Izračunavanje ukupnih cena i dostave
  const calculateTotals = (items) => {
    let subtotal = 0;
    items.forEach((item) => {
      const pricePerItem = item.naPopustu
        ? item.cijena * (1 - item.popustProcenat / 100)
        : item.cijena;
      subtotal += pricePerItem * item.quantity;
    });

    const shippingCost = subtotal > 0 && subtotal < 60 ? 10 : 0;
    const total = subtotal + shippingCost;

    return { subtotal, shippingCost, total };
  };

  // Funkcije za update statusa, količine i uklanjanje
  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const handleQuantityChange = async (orderId, item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const newItems = order.items.map((it) =>
      it.id === item.id ? { ...it, quantity: newQuantity } : it
    );

    const { subtotal, shippingCost, total } = calculateTotals(newItems);
    const orderRef = doc(db, "orders", orderId);

    try {
      await updateDoc(orderRef, {
        items: newItems,
        total,
        shippingCost,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, items: newItems, total, shippingCost } : o
        )
      );
    } catch (error) {
      console.error("Greška pri ažuriranju količine:", error);
    }
  };

  const handleRemoveItem = async (orderId, itemToRemove) => {
    // Postavi poruku i podatke za uklanjanje
    setPopupMessage(`Da li ste sigurni da želite ukloniti proizvod "${itemToRemove.naziv}" iz narudžbine?`);
    setPendingRemoval({ orderId, itemToRemove });
    setShowPopup(true);
  };

  const confirmRemoval = async () => {
    if (!pendingRemoval) return;

    const { orderId, itemToRemove } = pendingRemoval;
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const newItems = order.items.filter((i) => i.id !== itemToRemove.id);
    const { subtotal, shippingCost, total } = calculateTotals(newItems);
    const orderRef = doc(db, "orders", orderId);

    try {
      await updateDoc(orderRef, {
        items: newItems,
        total,
        shippingCost,
      });
      
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, items: newItems, total, shippingCost } : o
        )
      );
      
      // Resetuj popup state
      setShowPopup(false);
      setPendingRemoval(null);
    } catch (error) {
      console.error("Greška pri uklanjanju proizvoda:", error);
    }
  };

  const cancelRemoval = () => {
    setShowPopup(false);
    setPendingRemoval(null);
  };

  // Funkcija za pretragu sa filterima
  const handleSearch = async () => {
    setLoading(true);

    const ordersRef = collection(db, "orders");
    let constraints = [];

    if (searchOrderId.trim() !== "") {
      constraints.push(where("orderId", "==", searchOrderId.trim()));
    }

    if (filterStatus !== "") {
      constraints.push(where("status", "==", filterStatus));
    }

    if (filterDeliveryMethod !== "") {
      constraints.push(where("deliveryMethod", "==", filterDeliveryMethod));
    }

    if (
      filterDeliveryMethod === "Preuzimanje u apoteci" &&
      filterPickupPharmacy !== ""
    ) {
      constraints.push(
        where("userInfo.pickupPharmacy", "==", filterPickupPharmacy)
      );
    }

    if (filterDateFrom !== "") {
      const fromDate = new Date(filterDateFrom);
      constraints.push(where("createdAt", ">=", fromDate));
    }

    if (filterDateTo !== "") {
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      constraints.push(where("createdAt", "<=", toDate));
    }

    let q;
    try {
      if (constraints.length > 0) {
        q = query(ordersRef, ...constraints, orderBy("createdAt", "desc"));
      } else {
        setOrders([]);
        setLoading(false);
        return;
      }

      const querySnapshot = await getDocs(q);
      const filteredOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Greška pri dohvaćanju porudžbina:", error);
      alert("Greška pri pretrazi porudžbina.");
    }

    setLoading(false);
  };

  return (
    <div className="orders-container">
      <h1>Pretraga porudžbina</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Šifra narudžbine"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          style={{ padding: "6px", minWidth: "150px" }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "6px", minWidth: "150px" }}
        >
          <option value="">Status</option>
          {getFilterStatusOptions().map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filterDeliveryMethod}
          onChange={(e) => {
            setFilterDeliveryMethod(e.target.value);
            if (e.target.value !== "Preuzimanje u apoteci") {
              setFilterPickupPharmacy("");
            }
          }}
          style={{ padding: "6px", minWidth: "180px" }}
        >
          <option value="">Svi načini dostave</option>
          <option value="Dostava na adresu">Dostava na adresu</option>
          <option value="Preuzimanje u apoteci">Preuzimanje u apoteci</option>
        </select>

        {filterDeliveryMethod === "Preuzimanje u apoteci" && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <label>
              <input
                type="radio"
                name="pickupPharmacy"
                value="apoteka1"
                checked={filterPickupPharmacy === "apoteka1"}
                onChange={(e) => setFilterPickupPharmacy(e.target.value)}
              />
              Apoteka 1
            </label>

            <label>
              <input
                type="radio"
                name="pickupPharmacy"
                value="apoteka2"
                checked={filterPickupPharmacy === "apoteka2"}
                onChange={(e) => setFilterPickupPharmacy(e.target.value)}
              />
              Apoteka 2
            </label>
          </div>
        )}

        <label>
          Od:{" "}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            style={{ padding: "4px" }}
          />
        </label>

        <label>
          Do:{" "}
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            style={{ padding: "4px" }}
          />
        </label>

        <button
          onClick={handleSearch}
          style={{
            padding: "6px 12px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Pretraži
        </button>
      </div>

      {loading ? (
        <p>Učitavanje narudžbina...</p>
      ) : orders.length === 0 ? (
        <p>Nema porudžbina za odabrane filtere.</p>
      ) : (
        orders.map((order) => {
          const isDelivery = order.deliveryMethod === "Dostava na adresu";
          const statusOptions = isDelivery
            ? statusOptionsDelivery
            : statusOptionsPickup;

          const { subtotal, shippingCost, total } = calculateTotals(order.items);

          return (
            <div key={order.id} className="order-card">
              <table className="order-main-table">
                <tbody>
                  <tr>
                    <th>ID narudžbine:</th>
                    <td>{order.orderId}</td>
                    <th>Datum naručivanja:</th>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                        : "Nepoznat"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      <select
                        value={order.status || "Poručeno"}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="status-select"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <th>Način dostave:</th>
                    <td>{order.deliveryMethod}</td>
                  </tr>
                  <tr>
                    <th>Ime:</th>
                    <td>
                      {order.userInfo?.firstName} {order.userInfo?.lastName}
                    </td>
                    <th>Telefon:</th>
                    <td>{order.userInfo?.phone}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{order.userInfo?.email}</td>
                    {isDelivery ? (
                      <>
                        <th>Adresa:</th>
                        <td>
                          {order.userInfo?.address}, {order.userInfo?.city},{" "}
                          {order.userInfo?.postalCode}
                        </td>
                      </>
                    ) : (
                      <>
                        <th>Apoteka za preuzimanje:</th>
                        <td>{order.userInfo?.pickupPharmacy}</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>

              <div className="items-list">
                <h3>Artikli</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Šifra</th>
                      <th>Proizvod</th>
                      <th>Cena (po komadu)</th>
                      <th>Količina</th>
                      <th>Ukupno</th>
                      <th>Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => {
                      const pricePerItem = item.naPopustu
                        ? item.cijena * (1 - item.popustProcenat / 100)
                        : item.cijena;
                      const totalPrice = pricePerItem * item.quantity;

                      return (
                        <tr key={item.id}>
                          <td>{item.sifra || "N/A"}</td>
                          <td>{item.naziv}</td>
                          <td>{pricePerItem.toFixed(2)} BAM</td>
                          <td>
                            <button
                              onClick={() =>
                                handleQuantityChange(order.id, item, -1)
                              }
                              className="qty-btn"
                              disabled={item.quantity <= 1}
                              title={
                                item.quantity <= 1
                                  ? "Minimalna količina je 1"
                                  : "Smanji količinu"
                              }
                            >
                              −
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(order.id, item, 1)
                              }
                              className="qty-btn"
                              title="Povećaj količinu"
                            >
                              +
                            </button>
                          </td>
                          <td>{totalPrice.toFixed(2)} BAM</td>
                          <td>
                            <button
                              onClick={() => handleRemoveItem(order.id, item)}
                              className="remove-btn"
                              title="Ukloni proizvod iz narudžbine"
                            >
                              Ukloni
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div
                className="totals"
                style={{ textAlign: "right", marginTop: "20px" }}
              >
                <p>Ukupno artikala: {subtotal.toFixed(2)} BAM</p>
                <p>Trošak dostave: {shippingCost.toFixed(2)} BAM</p>
                <p>Ukupno za plaćanje: {total.toFixed(2)} BAM</p>
              </div>
            </div>
          );
        })
      )}

      {/* Popup za potvrdu uklanjanja */}
      <Popupyn
        isOpen={showPopup}
        onClose={cancelRemoval}
        onConfirm={confirmRemoval}
        message={popupMessage}
      />
    </div>
  );
};

export default Orders;