import React, { useEffect, useState } from "react";
import { db, functions } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import "./Orders.css";

/* STATUSI */
const DELIVERY_STATUSES = [
  "Poručeno",
  "Priprema",
  "Spremno za kurira",
  "Završeno",
];
const PICKUP_STATUSES = ["Poručeno", "Pripremljeno", "Preuzeto"];

/* NEXT STATUS – pojedinačno */
const getNextStatus = (status, tab) => {
  if (tab === "DOSTAVA") {
    if (status === "Poručeno") return "Priprema";
    return null;
  } else {
    if (status === "Poručeno") return "Pripremljeno";
    if (status === "Pripremljeno") return "Preuzeto";
    return null;
  }
};

const OrdersTabs = () => {
const [showWeightModal, setShowWeightModal] = useState(false);
const [weightValue, setWeightValue] = useState("");
const [selectedOrder, setSelectedOrder] = useState(null);


  const [activeMainTab, setActiveMainTab] = useState("DOSTAVA");
  const [activeStatusTab, setActiveStatusTab] = useState("Sve");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedItems, setEditedItems] = useState([]);

  const statusOptions =
    activeMainTab === "DOSTAVA" ? DELIVERY_STATUSES : PICKUP_STATUSES;
  const statusTabs = ["Sve", ...statusOptions];

  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductCode, setNewProductCode] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(1);

const printOpremnica = async (order) => {
  try {
    const fn = httpsCallable(functions, "printEuroExpressLabel");

    const res = await fn({
      refBroj: order.orderId,
      printFormat: "DEFAULT", // ili "BC"
    });

    const { base64, fileName, mimeType } = res.data;

    // base64 → Blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Greška pri štampi opremnice");
  }
};



  /* FETCH */
  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const ref = collection(db, "orders");
      let constraints = [];
      constraints.push(
        where(
          "deliveryMethod",
          "==",
          activeMainTab === "DOSTAVA"
            ? "Dostava na adresu"
            : "Preuzimanje u apoteci"
        )
      );
      if (status !== "Sve") {
        constraints.push(where("status", "==", status));
      }
      const q = query(ref, ...constraints, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      alert("Greška pri učitavanju porudžbina");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(activeStatusTab);
  }, [activeMainTab, activeStatusTab]);

  /* POJEDINAČNI STATUS */
  const handleNextStatus = async (order) => {
    const next = getNextStatus(order.status, activeMainTab);
    if (!next) return;

    await updateDoc(doc(db, "orders", order.id), { status: next });
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
  };

  /* EDIT STAVKE NARUDŽBINE */
  const startEditing = (order) => {
    setEditingOrderId(order.id);
    setEditedItems(order.items.map((i) => ({ ...i })));
  };

  const updateItemQuantity = (itemId, quantity) => {
    setEditedItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  const removeItem = (itemId) => {
    setEditedItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const saveEditedOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { items: editedItems });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, items: editedItems } : o))
      );
      setEditingOrderId(null);
    } catch (err) {
      console.error(err);
      alert("Greška pri spremanju izmjena");
    }
  };

  /* SLANJE KURIRU */
  const preannounce = async (payload) => {
    const preannounceCourier = httpsCallable(functions, "preannounceCourier");
    const payloadList = Array.isArray(payload) ? payload : [payload];
    try {
      const res = await preannounceCourier({ payload: payloadList });
      return res.data;
    } catch (err) {
      console.error("Greška pri pozivu kurira:", err.message);
      throw err;
    }
  };

  const sendAllToCourier = async () => {
    if (
      !window.confirm(
        "Ovo će poslati SVE pripremljene pošiljke kuriru. Nastaviti?"
      )
    )
      return;
    try {
      const fn = httpsCallable(functions, "sendAllPreparedToCourier");
      const res = await fn();
      alert(`Poslato ${res.data.sentCount} pošiljki kuriru`);
    } catch (err) {
      console.error(err);
      alert("Greška pri slanju kuriru");
    }
  };

  /* PRIPREMA NARUDŽBINE */

  const prepareOrder = async (order) => {
    try {
      const { subtotal, shipping, total } = calcTotals(order.items);

      if (order.deliveryMethod === "Dostava na adresu") {

     const obveznikPlacanja = subtotal < 60 ? 1 : 0;
      const nacinPlacanja = subtotal < 60 ? 0 : 1;
        // Dostava → kreiraj payload i pošalji kuriru
        const payload = {
          referentniBroj: order.orderId,
          vrstaPosiljkeSifra: 1,
          opisPosiljke: `Porudžbina #${order.orderId}`,
          tezina: order.packageWeight,
          brojPaketa: 1,
          vrednostPosiljke: total,
          //---------------------
          obveznikPlacanja:obveznikPlacanja,
         //---------------------
          nacinPlacanja: nacinPlacanja,
          //---------------------
          primalacNaziv: `${order.userInfo.firstName} ${order.userInfo.lastName}`,
          primalacIme: order.userInfo.firstName,
          primalacAdresa: order.userInfo.address,
          primalacPtt: order.userInfo.postalCode,
          primalacTelefon: order.userInfo.phone,
          naplataPouzecem: true,
          //---------------------
          iznosNaplatePouzecem: total,
          //---------------------
          nacinNp: 0,
          osiguranje: false,
          otvaranjePosiljke: false,
          napomena: `Porudžbina ${order.orderId}`,
        };

        await addDoc(collection(db, "courierOrders"), {
          orderId: order.id,
          referentniBroj: order.orderId,
          status: "priprema",
          payload,
          createdAt: serverTimestamp(),
        });

        await preannounce(payload);

        // update status
        await updateDoc(doc(db, "orders", order.id), { status: "Priprema" });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: "Priprema" } : o
          )
        );
      } else {
        await updateDoc(doc(db, "orders", order.id), {
  status: "Pripremljeno",
});

const sendPickupEmail = httpsCallable(
  functions,
  "sendPickupPreparedEmail"
);

if (order.userInfo?.email) {
  await sendPickupEmail({
    email: order.userInfo.email,
    ime: order.userInfo.firstName,
    orderId: order.orderId,
  });
}
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: "Pripremljeno" } : o
          )
        );
      }
    } catch (err) {
      console.error("Greška PRIPREMA:", err);
      alert("Greška pri pripremi narudžbine");
    }
  };

  /* BULK → Završeno */
  const finishAll = async () => {
    const batch = writeBatch(db);
    orders
      .filter((o) => o.status === "Spremno za kurira")
      .forEach((o) =>
        batch.update(doc(db, "orders", o.id), { status: "Završeno" })
      );
    await batch.commit();
    setOrders((prev) =>
      prev.map((o) =>
        o.status === "Spremno za kurira" ? { ...o, status: "Završeno" } : o
      )
    );
  };

  /* CIJENE */
  const calcTotals = (items) => {
    const subtotal = items.reduce((sum, i) => {
      const price = i.naPopustu
        ? i.cijena * (1 - i.popustProcenat / 100)
        : i.cijena;
      return sum + price * i.quantity;
    }, 0);
    const shipping = subtotal > 0 && subtotal < 60 ? 11.09 : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  };

  return (
    <div className="orders-container">
      <h1>Porudžbine</h1>

      {/* MAIN TABS */}
      <div className="orders-main-tabs">
        <button
          className={activeMainTab === "DOSTAVA" ? "active" : ""}
          onClick={() => {
            setActiveMainTab("DOSTAVA");
            setActiveStatusTab("Sve");
          }}
        >
          Dostava
        </button>
        <button
          className={activeMainTab === "APOTEKA" ? "active" : ""}
          onClick={() => {
            setActiveMainTab("APOTEKA");
            setActiveStatusTab("Sve");
          }}
        >
          Apoteka
        </button>
      </div>

      {/* STATUS TABS */}
      <div className="status-container">
        {statusTabs.map((s) => (
          <button
            key={s}
            className={activeStatusTab === s ? "active" : ""}
            onClick={() => setActiveStatusTab(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* BULK ACTIONS */}
      {activeMainTab === "DOSTAVA" && activeStatusTab === "Priprema" && (
        <button className="bulk-btn" onClick={sendAllToCourier}>
          Sve označi kao „Spremno za kurira“
        </button>
      )}
      {activeMainTab === "DOSTAVA" &&
        activeStatusTab === "Spremno za kurira" && (
          <button className="bulk-btn success" onClick={finishAll}>
            Sve označi kao „Završeno“
          </button>
        )}

      {/* CONTENT */}
      {loading ? (
        <p>Učitavanje...</p>
      ) : orders.length === 0 ? (
        <p>Nema porudžbina.</p>
      ) : (
        orders.map((order) => {
          const { subtotal, shipping, total } = calcTotals(order.items);
          const next = getNextStatus(order.status, activeMainTab);
          const isDelivery = order.deliveryMethod === "Dostava na adresu";

          return (
            <div key={order.id} className="order-card">
              <table className="order-main-table">
                <tbody>
                  <tr>
                    <th>ID:</th>
                    <td>{order.orderId}</td>
                    <th>Datum:</th>
                    <td>
                      {order.createdAt?.toDate?.()?.toLocaleString() ||
                        "Nepoznat"}
                    </td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>{order.status}</td>
                    <th>Način:</th>
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
                        <th>Apoteka:</th>
                        <td>{order.userInfo?.pickupPharmacy}</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>

              {/* EDITABLE ITEMS */}
              {editingOrderId === order.id ? (
                <div className="editing-items">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Proizvod</th>
                        <th>Cijena</th>
                        <th>Količina</th>
                        <th>Ukupno</th>
                        <th>Akcija</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedItems.map((i) => {
                        const price = i.naPopustu
                          ? i.cijena * (1 - i.popustProcenat / 100)
                          : i.cijena;
                        return (
                          <tr key={i.id}>
                            <td>{i.naziv}
                             
                            </td>

                            <td>{price.toFixed(2)} KM</td>
                            <td>
                              <input
                                type="number"
                                min={1}
                                value={i.quantity}
                                onChange={(e) =>
                                  updateItemQuantity(
                                    i.id,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td>{(price * i.quantity).toFixed(2)} KM</td>
                            <td>
                              <button onClick={() => removeItem(i.id)}>
                                Obriši
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <button onClick={() => saveEditedOrder(order.id)}>
                    Spremi izmjene
                  </button>
                  <button onClick={() => setEditingOrderId(null)}>
                    Otkaži
                  </button>
                  <button onClick={() => setAddingProduct(true)}>
                    Dodaj proizvod
                  </button>

                  {/* ADD PRODUCT POPUP */}
                  {addingProduct && (
                    <div className="popup-overlay">
                      <div className="popup-content">
                        <h2>Dodaj proizvod</h2>
                        <label>
                          Šifra proizvoda:
                          <input
                            type="text"
                            value={newProductCode}
                            onChange={(e) => setNewProductCode(e.target.value)}
                          />
                        </label>
                        <label>
                          Količina:
                          <input
                            type="number"
                            min={1}
                            value={newProductQuantity}
                            onChange={(e) =>
                              setNewProductQuantity(Number(e.target.value))
                            }
                          />
                        </label>
                        <div className="popup-buttons">
                          <button
                            onClick={async () => {
                              if (!newProductCode)
                                return alert("Unesite šifru proizvoda");
                              try {
                                const snap = await getDocs(
                                  query(
                                    collection(db, "products"),
                                    where("sifra", "==", newProductCode)
                                  )
                                );
                                if (snap.empty)
                                  return alert("Proizvod nije pronađen");
                                const product = snap.docs[0].data();

                                const newItem = {
                                  id: snap.docs[0].id,
                                  naziv: product.naziv,
                                  cijena: product.cijena,
                                  naPopustu: product.naPopustu || false,
                                  popustProcenat: product.popustProcenat || 0,
                                  quantity: newProductQuantity,
                                };

                                const updatedItems = [...editedItems, newItem];
                                await updateDoc(
                                  doc(db, "orders", editingOrderId),
                                  {
                                    items: updatedItems,
                                  }
                                );

                                setEditedItems(updatedItems);
                                setAddingProduct(false);
                                setNewProductCode("");
                                setNewProductQuantity(1);
                              } catch (err) {
                                console.error(err);
                                alert("Greška pri dodavanju proizvoda");
                              }
                            }}
                          >
                            Dodaj
                          </button>
                          <button onClick={() => setAddingProduct(false)}>
                            Otkaži
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Proizvod</th>
                      <th>Cijena</th>
                      <th>Količina</th>
                      <th>Ukupno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((i) => {
                      const price = i.naPopustu
                        ? i.cijena * (1 - i.popustProcenat / 100)
                        : i.cijena;
                      return (
                        <tr key={i.id}>
                          <td>{i.naziv}
                             {i.selectedSize ? ` (${i.selectedSize})` : ""}
                          </td>
                          <td>{price.toFixed(2)} KM</td>
                          <td>{i.quantity}</td>
                          <td>{(price * i.quantity).toFixed(2)} KM</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

         <div className="totals">
  <p>Artikli: {subtotal.toFixed(2)} KM</p>
  {order.deliveryMethod === "Dostava na adresu" && (
    <p>Dostava: {shipping.toFixed(2)} KM</p>
  )}
  <p className="total">
    Ukupno: 
    {order.deliveryMethod === "Dostava na adresu"
      ? (subtotal + shipping).toFixed(2)
      : subtotal.toFixed(2)} KM
  </p>
</div>
              {/* ACTION BUTTONS */}
              {order.status === "Poručeno" && editingOrderId !== order.id ? (
                <>
                  <button
                    onClick={() => startEditing(order)}
                    className="next-status-btn"
                  >
                    Uredi stavke
                  </button>
           <button
  className="next-status-btn"
  onClick={() => {
    if (order.deliveryMethod === "Dostava na adresu") {
      // 🚚 Dostava → traži težinu
      setSelectedOrder(order);
      setWeightValue("");
      setShowWeightModal(true);
    } else {
      // 🏪 Apoteka → direktno pripremljeno
      prepareOrder(order);
    }
  }}
>
  {order.deliveryMethod === "Dostava na adresu"
    ? 'Pređi u "Pripremu"'
    : 'Označi kao "Pripremljeno"'}
</button>
                </>
              ) : next ? (
                <button
                  className="next-status-btn"
                  onClick={() => handleNextStatus(order)}
                >
                  Pređi u „{next}“
                </button>
              ) : null}

              {order.status === "Priprema" &&
  order.deliveryMethod === "Dostava na adresu" && (
    <button
      className="next-status-btn secondary"
      onClick={() => printOpremnica(order)}
    >
      🖨️ Štampaj opremnicu
    </button>
)}
            </div>
          );
        })
      )}

{showWeightModal && (
  <div className="weight-popup-overlay">
    <div className="weight-popup-content">
      <h2 className="weight-popup-title">Unos težine pošiljke</h2>

      <label className="weight-popup-label">
        Težina (kg):
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={weightValue}
          onChange={(e) => setWeightValue(e.target.value)}
          className="weight-popup-input"
        />
      </label>

      <div className="weight-popup-buttons">
        <button
          className="weight-popup-btn confirm"
          onClick={() => {
            if (!weightValue || Number(weightValue) <= 0) {
              alert("Morate unijeti validnu težinu");
              return;
            }

            prepareOrder({
              ...selectedOrder,
              packageWeight: Number(weightValue),
            });

            setShowWeightModal(false);
            setSelectedOrder(null);
          }}
        >
          Potvrdi
        </button>

        <button
          className="weight-popup-btn cancel"
          onClick={() => {
            setShowWeightModal(false);
            setSelectedOrder(null);
          }}
        >
          Otkaži
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OrdersTabs;
