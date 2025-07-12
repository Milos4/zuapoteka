import React, { useEffect, useState } from "react";
import "./OrderHistory.css";

const dummyOrders = [
  {
    id: "ORD123456",
    price: 150,
    deliveryMethod: "dostava",
    status: "poslato",
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
      {
        id: "p1",
        name: "Biljka Fikus",
        quantity: 1,
        price: 50,
        image: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg"
      },
      {
        id: "p2",
        name: "Kaktus",
        quantity: 2,
        price: 50,
        image: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg"
      },
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
      {
        id: "p3",
        name: "Monstera",
        quantity: 1,
        price: 80,
        image: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg"
      },
    ],
  },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductsPopup, setShowProductsPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

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
            <div className="products-popup">
              {selectedOrder.products.map((p, i) => (
                <div key={i} className="product-line">
                  <div className="product-info">
                    <span className="product-name">{p.name}</span>
                    <span className="product-meta">Količina: {p.quantity} kom</span>
                    <span className="product-meta">Cijena: {p.price.toFixed(2)} KM</span>
                  </div>
                  <img
                    src={p.image || "/placeholder.png"}
                    alt={p.name}
                    className="product-image"
                  />
                </div>
              ))}
            </div>
            <button className="btnZatvori" onClick={() => setShowProductsPopup(false)}>Zatvori</button>
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

      {selectedOrder.deliveryMethod === "preuzimanje" ? (
        <p><strong>Adresa apoteke:</strong> {selectedOrder.pharmacyAddress || "Apoteka Centar, Ulica Kralja Petra I 15"}</p>
      ) : (
        <>
          <p><strong>Grad:</strong> {selectedOrder.customerData?.city}</p>
          <p><strong>Poštanski broj:</strong> {selectedOrder.customerData?.postalCode}</p>
          <p><strong>Adresa:</strong> {selectedOrder.customerData?.address}</p>
        </>
      )}

      <button  className="btnZatvori"onClick={() => setShowDetailsPopup(false)}>Zatvori</button>
    </div>
  </div>
)}

    </div>
  );
};

export default OrderHistory;
