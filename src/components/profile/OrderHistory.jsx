import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./OrderHistory.css";

const dummyOrders = [
  {
    id: "ORD123456",
    price: 150,
    deliveryMethod: "dostava", // ili "preuzimanje"
    status: "poslato", // npr. "poručeno", "poslato", "isporučeno", "spremno"
    date: "2025-07-10",
    customerData: {
      firstName: "Marko",
      lastName: "Marković",
      address: "Ulica Kralja Petra 10",
      city: "Beograd",
      postalCode: "11000",
      phone: "+381601234567",
      email: "marko@example.com",
    },
    products: [
      { id: "p1", name: "Biljka Fikus", quantity: 1, price: 50 },
      { id: "p2", name: "Kaktus", quantity: 2, price: 50 },
    ],
  },
  {
    id: "ORD789101",
    price: 80,
    deliveryMethod: "preuzimanje",
    status: "spremno",
    date: "2025-07-12",
    customerData: {
      firstName: "Jelena",
      lastName: "Jovanović",
      address: "Bulevar Oslobođenja 20",
      city: "Novi Sad",
      postalCode: "21000",
      phone: "+381641234567",
      email: "jelena@example.com",
    },
    products: [
      { id: "p3", name: "Monstera", quantity: 1, price: 80 },
    ],
  },
  {
    id: "ORD111213",
    price: 200,
    deliveryMethod: "dostava",
    status: "poručeno",
    date: "2025-07-13",
    customerData: {
      firstName: "Nikola",
      lastName: "Nikolić",
      address: "Trg Republike 5",
      city: "Niš",
      postalCode: "18000",
      phone: "+381601112233",
      email: "nikola@example.com",
    },
    products: [
      { id: "p4", name: "Drvo Bonsai", quantity: 1, price: 200 },
    ],
  },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductsPopup, setShowProductsPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const q = query(
  //         collection(db, "orders"),
  //         where("userId", "==", user.uid)
  //       );
  //       const snapshot = await getDocs(q);
  //       const ordersData = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setOrders(ordersData);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    setOrders(dummyOrders);
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("sr-Latn-BA");
  };

  return (
    <div className="order-history-container">
      <h2>Istorija narudžbi</h2>

      {orders.length === 0 ? (
        <p>Nemate nijednu narudžbinu.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Datum:</strong> {formatDate(order.date)}</p>
              <p><strong>Cijena:</strong> {order.price.toFixed(2)} KM</p>
              <p>
                <strong>Način:</strong>{" "}
                {order.deliveryMethod === "dostava" ? "Dostava" : "Preuzimanje"}
              </p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
            <div className="order-buttons">
              <button
                className="btn-details"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowProductsPopup(true);
                }}
              >
                Vidi proizvode
              </button>
              <button
                className="btn-details"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowDetailsPopup(true);
                }}
              >
                Vidi podatke
              </button>
            </div>
          </div>
        ))
      )}

      {/* Proizvodi popup */}
      {showProductsPopup && selectedOrder && (
        <div className="popup-overlay" onClick={() => setShowProductsPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Proizvodi</h3>
            <ul>
              {selectedOrder.products.map((p, i) => (
                <li key={i}>
                  {p.name} ({p.quantity} kom) - {p.price.toFixed(2)} KM
                </li>
              ))}
            </ul>
            <button onClick={() => setShowProductsPopup(false)}>Zatvori</button>
          </div>
        </div>
      )}

      {/* Podaci popup */}
      {showDetailsPopup && selectedOrder && (
        <div className="popup-overlay" onClick={() => setShowDetailsPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Lični podaci</h3>
            <p><strong>Ime:</strong> {selectedOrder.customerData?.firstName}</p>
            <p><strong>Prezime:</strong> {selectedOrder.customerData?.lastName}</p>
            <p><strong>Email:</strong> {selectedOrder.customerData?.email}</p>
            <p><strong>Telefon:</strong> {selectedOrder.customerData?.phone}</p>
            <p><strong>Grad:</strong> {selectedOrder.customerData?.city}</p>
            <p><strong>Poštanski broj:</strong> {selectedOrder.customerData?.postalCode}</p>
            <p><strong>Adresa:</strong> {selectedOrder.customerData?.address}</p>
            <button onClick={() => setShowDetailsPopup(false)}>Zatvori</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
