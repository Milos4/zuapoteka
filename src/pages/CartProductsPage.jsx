import React, { useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import MiniProduct from "../components/MiniProduct";
import "../styles/colors.css";
import img2 from '../assets/products/img2.jpg';
const sampleProducts = [
  { id: 1, name: "Biljka Fikus", price: 2500, originalPrice: 3000, onSale: true, image: img2 },
  { id: 2, name: "Kaktus", price: 1200, originalPrice: 12, onSale: false },
  { id: 3, name: "Monstera", price: 300, originalPrice: 40, onSale: true },
  { id: 4, name: "Monstera", price: 300, originalPrice: 400, onSale: false },
  { id: 5, name: "Monstera", price: 300, originalPrice: 40, onSale: true },
  { id: 6, name: "Monstera", price: 300, originalPrice: 40, onSale: true },
  { id: 7, name: "Monstera", price: 300, originalPrice: 200, onSale: true },
  { id: 8, name: "Monstera", price: 300, originalPrice: 1000, onSale: true },
  { id: 9, name: "Monstera", price: 300, originalPrice: 200, onSale: true },
  { id: 10, name: "Monstera", price: 300, originalPrice: 100, onSale: true },
  { id: 11, name: "Monstera", price: 300, originalPrice: 500, onSale: true },
];

const CartProductsPage = () => {
  const [cart, setCart] = useState(
    sampleProducts.map((product) => ({ ...product, quantity: 1 }))
  );

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const total = (subtotal ).toFixed(2);

  return (
    <div style={{ backgroundColor: "var(--bez)", minHeight: "100vh" }}>
      <Navbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          padding: "40px 16px",
          flexWrap: "wrap",
        }}
      >
        {/* Leva strana - proizvodi */}
        <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                backgroundColor: "var(--skoroBijela)",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
                overflow: "hidden",
                minHeight: "120px",
                position: "relative",
                border: "1px solid var(--svijetloZelena)",
              }}
            >
              {item.onSale && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "var(--crvena)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                >
                  POPUST
                </div>
              )}

              <img
                src="/assets/example-product.jpg"
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  flex: 1,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ margin: 0, color: "var(--tamnoZelena)" }}>{item.name}</h3>
                <div>
                  {item.onSale && (
                    <p
                      style={{
                        margin: "4px 0",
                        textDecoration: "line-through",
                        color: "#999",
                        fontSize: "14px",
                      }}
                    >
                      {item.originalPrice * item.quantity} BAM
                    </p>
                  )}
                  <p
                    style={{
                      margin: "4px 0",
                      fontWeight: "bold",
                      color: item.onSale ? "var(--crvena)" : "inherit",
                      fontSize: item.onSale ? "18px" : "16px",
                    }}
                  >
                    {item.price * item.quantity} BAM
                    {item.onSale && (
                      <span
                        style={{
                          marginLeft: "8px",
                          backgroundColor: "var(--svijetloZelena)",
                          color: "var(--tamnoZelena)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        Ušteda {(item.originalPrice - item.price) * item.quantity} BAM
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    style={{
                      padding: "4px 12px",
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "1px solid var(--zelena)",
                      backgroundColor: "var(--svijetloZelena)",
                      color: "var(--tamnoZelena)",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.2s ease",
                      ":hover": {
                        backgroundColor: "var(--zelena)",
                        color: "white",
                      },
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      minWidth: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{
                      padding: "4px 12px",
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "1px solid var(--zelena)",
                      backgroundColor: "var(--zelena)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "all 0.2s ease",
                      ":hover": {
                        backgroundColor: "var(--tamnoZelena)",
                        borderColor: "var(--tamnoZelena)",
                      },
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#f55",
                    border: "1px solid #f55",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontWeight: "bold",
                    ":hover": {
                      backgroundColor: "#f55",
                      color: "white",
                    },
                  }}
                >
                  Ukloni
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desna strana - račun */}
        <div
          style={{
            backgroundColor: "var(--svijetloZelena)",
            border: "1px solid var(--zelena)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "350px",
            width: "100%",
            height: "fit-content",
            position: "sticky",
            top: "20px",
          }}
        >
          <h2 style={{ marginBottom: "10px", color: "var(--tamnoZelena)" }}>
            Ukupno
          </h2>
          <p style={{ margin: 0, color: "#555" }}>
            {cart.reduce((sum, i) => sum + i.quantity, 0)} artikala
          </p>

          <hr style={{ margin: "10px 0", borderColor: "var(--zelena)" }} />

          <div style={{ fontSize: "14px", color: "#444" }}>
            <p>
              Iznos artikala: <strong>{subtotal} BAM</strong>
            </p>
            {cart.some((item) => item.onSale) && (
              <p
                style={{
                  color: "var(--crvena)",
                  
                  marginTop: "8px",
                }}
              >
                Ušteda:<strong>
                {cart
                  .filter((item) => item.onSale)
                  .reduce(
                    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
                    0
                  )}{" "}
                BAM </strong>
              </p>
            )}
            
            <p>
              Poštarina: <strong>0 BAM</strong>
            </p>
            <hr />
            <p style={{ fontWeight: "bold", fontSize: "16px" }}>
              Ukupno: {total} BAM
            </p>
            
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              style={{
                border: "none",
                background:
                  "linear-gradient(to right, var(--zelena), var(--tamnoZelena))",
                color: "white",
                padding: "12px 32px",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                width: "100%",
                transition: "all 0.3s ease",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              Kupi
            </button>
          </div>
        </div>
      </div>
      <MiniProduct />
      <Footer />
    </div>
  );
};

export default CartProductsPage;