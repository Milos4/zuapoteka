import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
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
import "./Orders.css";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
/* STATUSI */
const DELIVERY_STATUSES = [
  "Poručeno",
  "Priprema",
  "Spremno za kurira",
  "Završeno",
];

const username = "higra_api_test";
const password = "test1234!";

const auth = btoa(`${username}:${password}`);

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
  const [activeMainTab, setActiveMainTab] = useState("DOSTAVA");
  const [activeStatusTab, setActiveStatusTab] = useState("Sve");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions =
    activeMainTab === "DOSTAVA" ? DELIVERY_STATUSES : PICKUP_STATUSES;

  const statusTabs = ["Sve", ...statusOptions];

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

  const preannounce = async (payload) => {
    const preannounceCourier = httpsCallable(functions, "preannounceCourier");

    // Uvek šalji listu
    const payloadList = Array.isArray(payload) ? payload : [payload];

    console.log(JSON.stringify(payloadList, null, 2)); // lepo formatiran JSON
    try {
      const res = await preannounceCourier({ payload: payloadList });
      console.log(res);
      return res.data;
    } catch (err) {
      console.error("Greška pri pozivu kurira:", err.message);
      throw err;
    }
  };

  const sendAllToCourier = async () => {
    if (
      !window.confirm(
        "Ovo će poslati SVE pripremljene pošiljke kuriru i više se NE MOGU menjati. Nastaviti?"
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

  const prepareOrder = async (order) => {
    try {
      const { subtotal, shipping, total } = calcTotals(order.items);

      const payload = {
        referentniBroj: order.orderId,
        vrstaPosiljkeSifra: 1,
        opisPosiljke: `Porudžbina #${order.orderId}`,
        tezina: 0.2,
        brojPaketa: 1,
        vrednostPosiljke: total,
        obveznikPlacanja: 0,
        nacinPlacanja: 1,

        primalacNaziv: `${order.userInfo.firstName} ${order.userInfo.lastName}`,
        primalacIme: order.userInfo.firstName,
        primalacAdresa: order.userInfo.address,
        primalacPtt: order.userInfo.postalCode,
        primalacTelefon: order.userInfo.phone,

        naplataPouzecem: true,
        iznosNaplatePouzecem: total,
        nacinNp: 0,
        osiguranje: false,
        otvaranjePosiljke: false,
        napomena: `Porudžbina ${order.orderId}`,
      };

      // 1️⃣ snimi u posebnu kolekciju
      await addDoc(collection(db, "courierOrders"), {
        orderId: order.id,
        referentniBroj: order.orderId,
        status: "priprema",
        payload,
        createdAt: serverTimestamp(),
      });

      // 2️⃣ Poziv ka kuriru preko httpsCallable

      await preannounce(payload);

      // 3️⃣ update status u orders
      await updateDoc(doc(db, "orders", order.id), { status: "Priprema" });

      // 4️⃣ update UI
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "Priprema" } : o))
      );
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

    const shipping = subtotal > 0 && subtotal < 60 ? 10 : 0;
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
                        <td>{i.naziv}</td>
                        <td>{price.toFixed(2)} KM</td>
                        <td>{i.quantity}</td>
                        <td>{(price * i.quantity).toFixed(2)} KM</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="totals">
                <p>Artikli: {subtotal.toFixed(2)} KM</p>
                <p>Dostava: {shipping.toFixed(2)} KM</p>
                <p className="total">Ukupno: {total.toFixed(2)} KM</p>
              </div>

              {activeMainTab === "DOSTAVA" && order.status === "Poručeno" ? (
                <button
                  className="next-status-btn"
                  onClick={() => prepareOrder(order)}
                >
                  Pređi u "Pripremi"
                </button>
              ) : next ? (
                <button
                  className="next-status-btn"
                  onClick={() => handleNextStatus(order)}
                >
                  Pređi u „{next}“
                </button>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrdersTabs;
