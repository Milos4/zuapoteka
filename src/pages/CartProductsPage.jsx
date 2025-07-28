import React from "react";
import Footer from "../components/Footer";
import MiniProduct from "../components/MiniProduct";
import "../styles/colors.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 👈 koristimo kontekst
import "./CartProductsPage.css"

const CartProductsPage = () => {
const { cartItems: cart, updateQuantity, removeFromCart, setCartItems } = useCart();

const updateQuantityHandler = (id, delta) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const newQuantity = Math.max(1, item.quantity + delta);
  updateQuantity(id, newQuantity); // poziv funkcije iz konteksta koja sinhronizuje i Firestore
};

const removeItemHandler = (id) => {
  removeFromCart(id); // koristi funkciju iz konteksta
};

  const calculateItemTotal = (item) => {
    const price = item.naPopustu
      ? item.cijena * (1 - item.popustProcenat / 100)
      : item.cijena;
    return price * item.quantity;
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const total = subtotal.toFixed(2);

  return (
    <div style={{ backgroundColor: "var(--bez)", minHeight: "100vh" }}>
      <div
       className="cart-wrapper"
      >
        {/* Leva strana - proizvodi */}
        <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
          {cart.map((item) => {
            const originalPrice = item.cijena;
            const discount = item.popustProcenat || 0;
            const finalPrice = item.naPopustu
              ? originalPrice * (1 - discount / 100)
              : originalPrice;

            return (
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
                className="proizvodi"
              >
                {item.naPopustu && (
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
                  src={item.slikaURL || "/assets/example-product.jpg"}
                  alt={item.naziv}
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
                  <h3 style={{ margin: 0, color: "var(--tamnoZelena)" }}>
                    {item.naziv}
                  </h3>
                  <div>
                    {item.naPopustu && (
                      <p
                        style={{
                          margin: "4px 0",
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "14px",
                        }}
                      >
                        {(originalPrice * item.quantity).toFixed(2)} BAM
                      </p>
                    )}
                    <p
                      style={{
                        margin: "4px 0",
                        fontWeight: "bold",
                        color: item.naPopustu ? "var(--crvena)" : "inherit",
                        fontSize: item.naPopustu ? "18px" : "16px",
                      }}
                    >
                      {(finalPrice * item.quantity).toFixed(2)} BAM
                      {item.naPopustu && (
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
                          Ušteda:{" "}
                          {(
                            (originalPrice - finalPrice) *
                            item.quantity
                          ).toFixed(2)}{" "}
                          BAM
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => updateQuantityHandler(item.id, -1)}
                      style={{
                        padding: "4px 12px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid var(--zelena)",
                        backgroundColor: "var(--svijetloZelena)",
                        color: "var(--tamnoZelena)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "bold" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>  updateQuantityHandler(item.id, 1)}
                      style={{
                        padding: "4px 12px",
                        fontSize: "16px",
                        borderRadius: "6px",
                        border: "1px solid var(--zelena)",
                        backgroundColor: "var(--zelena)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItemHandler(item.id)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#f55",
                      border: "1px solid #f55",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            );
          })}
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
          <h2 style={{ marginBottom: "10px", color: "var(--tamnoZelena)" }}>Ukupno</h2>
          <p style={{ margin: 0, color: "#555" }}>
            {cart.reduce((sum, i) => sum + i.quantity, 0)} artikala
          </p>

          <hr style={{ margin: "10px 0", borderColor: "var(--zelena)" }} />

          <div style={{ fontSize: "14px", color: "#444" }}>
            <p>
              Iznos artikala: <strong>{subtotal.toFixed(2)} BAM</strong>
            </p>
            {cart.some((item) => item.naPopustu) && (
              <p style={{ color: "var(--crvena)", marginTop: "8px" }}>
                Ušteda:{" "}
                <strong>
                  {cart
                    .filter((item) => item.naPopustu)
                    .reduce(
                      (sum, item) =>
                        sum +
                        (item.cijena * item.popustProcenat) / 100 * item.quantity,
                      0
                    )
                    .toFixed(2)}{" "}
                  BAM
                </strong>
              </p>
            )}

        
            <hr />
            <p style={{ fontWeight: "bold", fontSize: "16px" }}>Ukupno: {total} BAM</p>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link
              to="/kupi"
              style={{
                textDecoration: "none",
                border: "none",
                background: "linear-gradient(to right, var(--zelena), var(--tamnoZelena))",
                color: "white",
                padding: "12px 32px",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                display: "inline-block",
                width: "80%",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              Kupi
            </Link>
          </div>
        </div>
      </div>

      
      <Footer />
    </div>
  );
};

export default CartProductsPage;
