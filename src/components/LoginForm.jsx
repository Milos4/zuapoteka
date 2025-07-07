import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import login from "../assets/Slika2.jpg";
import "./LoginForm.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { usernameOrEmail, password } = formData;

    if (!usernameOrEmail || !password) {
      alert("Popunite sva polja.");
      return;
    }

    try {
      let emailToUse = usernameOrEmail;

      // Ako nije email, traži username u Firestore-u
      if (!usernameOrEmail.includes("@")) {
        const q = query(
          collection(db, "users"),
          where("username", "==", usernameOrEmail)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Korisničko ime nije pronađeno.");
          return;
        }

        const userDoc = querySnapshot.docs[0].data();
        emailToUse = userDoc.email;
      }
      // Login sa emailom i šifrom
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password
      );

      // Nakon prijave, učitaj rolu iz Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.role === "admin") {
          navigate("/admin"); // Ako je admin, idi na admin dashboard
        } else {
          navigate("/pocetna"); // Inače idi na početnu
        }
      } else {
        // Ako nema role, idi na početnu
        navigate("/pocetna");
      }
    } catch (error) {
      alert("Greška pri prijavi: " + error.message);
    }
  };
  return (
    <div className="login-container">
      {/* Left: Image */}
      <div className="login-image">
        <img src={login} alt="Placeholder" />
      </div>

      {/* Right: Form */}
      <div className="login-form">
        <h1>Prijava</h1>
        <form action="#" method="POST" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Korisničko ime ili email</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              autoComplete="off"
              value={formData.usernameOrEmail}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Šifra</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Remember me */}
          <div className="form-remember">
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Ostani prijavljen</label>
          </div>

          {/* Forgot password */}
          <div className="form-forgot">
            <Link to="/zaboravljenja-sifra">Zaboravio šifru?</Link>
          </div>

          {/* Login button */}
          <button type="submit" className="login-button">
            Prijavi se
          </button>
        </form>

        {/* Signup link */}
        <div className="form-signup">
          <Link to="/registracija">Registruj se</Link>
        </div>

        <div className="back-to-home">
          <Link to="/pocetna">← Nazad na početnu</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
