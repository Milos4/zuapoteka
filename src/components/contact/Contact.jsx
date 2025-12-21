import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: "pending",   // status da znamo da nije odgovoreno
        response: "",
        respondedAt: null,
      });

      setSuccessMsg("Poruka je uspješno poslana!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Greška pri slanju poruke:", err);
      setErrorMsg("Došlo je do greške, pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Mapa */}
      <div className="map-placeholder">
        <p>Ovde ide Google mapa sa lokacijom apoteke</p>
      </div>

      {/* Lokacije */}
      <div className="locations">
        <div className="location">
          <h3>Apoteka Higra Saric</h3>
          <p>Agrotrzni centar Lamela B</p>
          <p>Telefon: 055/240-666</p>
          <p>Radno vreme: Pon-Pet 08:00 - 18:00</p>
        </div>
        <div className="location">
          <h3>Apoteka Higra Saric - Bijeljina</h3>
          <p>Ulica: Bulevar Zorana Đinđića 88, Bijeljina</p>
          <p>Telefon: 011/654-321</p>
          <p>Radno vreme: Pon-Pet 08:00 - 18:00</p>
        </div>
      </div>

      {/* Kontakt forma */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Kontaktirajte nas</h2>
        <input
          type="text"
          name="name"
          placeholder="Vaše ime"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Vaš email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Naslov poruke"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Vaša poruka"
          rows="6"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? "Šaljem..." : "Pošalji poruku"}
        </button>

        {successMsg && <p className="success-msg">{successMsg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Contact;
