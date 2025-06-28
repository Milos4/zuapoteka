import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RegistrationForm.css";
import { auth, db } from "../firebase"; // putanja do firebase.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Šifre se ne poklapaju!");
      return;
    }

    try {
      // Kreiraj korisnika u Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Sačuvaj podatke u Firestore (username + email + role)
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        role: "korisnik",
      });

      alert("Registracija uspešna!");
      navigate("/prijava");
      // opcionalno: redirect na login stranicu
    } catch (err) {
      console.error("Greška:", err.message);
      alert("Greška pri registraciji: " + err.message);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h1>Registracija</h1>
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="registration-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="registration-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="registration-group">
            <label htmlFor="password">Šifra</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <div className="registration-group">
            <label htmlFor="confirmPassword">Ponovi šifru</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <button type="submit" className="registration-button">
            Registruj se
          </button>

          <div className="registration-link">
            <Link to="/prijava">Već imate nalog? Prijavite se</Link>
          </div>

          <div className="back-to-home">
            <Link to="/pocetna">← Nazad na početnu</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
