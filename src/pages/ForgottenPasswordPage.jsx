import React, { useState } from "react";
import { auth, db } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./ForgottenPassword.css";
import resetImg from "../assets/Slika2.jpg";

const ForgottenPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Unesite email.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Provjera u Firestore users kolekciji
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Email ne postoji.");
        setLoading(false);
        return;
      }

      // 2️⃣ Slanje Firebase reset maila
      await sendPasswordResetEmail(auth, email);

      setMessage(
        "Email za reset šifre je poslan. Provjerite inbox ili spam."
      );
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Došlo je do greške. Pokušajte ponovo.");
    }

    setLoading(false);
  };

  return (
    <div className="fp-container">
      <div className="fp-image">
        <img src={resetImg} alt="Reset password" />
      </div>

      <div className="fp-form">
        <h1>Zaboravljena šifra</h1>

        <form onSubmit={handleSubmit}>
          <div className="fp-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="fp-error">{error}</p>}
          {message && <p className="fp-success">{message}</p>}

          <button className="fp-button" disabled={loading}>
            {loading ? "Slanje..." : "Pošalji email"}
          </button>
        </form>

        <div className="fp-back">
          <Link to="/login">← Nazad na prijavu</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgottenPasswordPage;
