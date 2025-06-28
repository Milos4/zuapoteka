import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Ovde možeš dodati slanje forme putem API-ja
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
          <p>Agrotrzni centar Lamela B , Bijeljina Ulica 456</p>
          <p>Telefon: 011/123-456</p>
          <p>Radno vreme: Pon-Pet 08:00 - 20:00</p>
        </div>
        <div className="location">
          <h3>Apoteka Higra Saric - Bijeljina</h3>
          <p>Ulica: Bulevar Zorana Đinđića 88, Bijeljina</p>
          <p>Telefon: 011/654-321</p>
          <p>Radno vreme: Pon-Pet 08:00 - 21:00</p>
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
        <button type="submit">Pošalji poruku</button>
      </form>
    </div>
  );
};

export default Contact;
