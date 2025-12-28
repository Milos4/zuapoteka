import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Contact.css";
import mapa from "../../assets/mapa.png";
import { FaMapMarkerAlt } from "react-icons/fa";

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
    console.log("Form submitted:", formData);
    // Ovde možeš dodati slanje forme putem API-ja
  };

  return (
    <div className="contact-container">
      {/* MAPA */}
      <a
        href="https://www.google.com/maps/place/Apoteka+Higra+Sari%C4%87/data=!4m2!3m1!1s0x0:0x97a8dcf7eb5e9e8e?sa=X&ved=1t:2428&ictx=111"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-map-link"
      >
        <img
          src={mapa}
          alt="Pronađi nas na Google mapama"
          className="contact-map-img"
        />
        <div className="contact-map-text">
          <FaMapMarkerAlt />
          <span>Otvori lokaciju u Google mapama</span>
        </div>
      </a>

      {/* LOKACIJE */}
      <div className="locations">
        <div className="location">
          <h3>Apoteka Higra Sarić</h3>
          <p>Agrotržni centar Lamela B</p>
          <p>Telefon: 055/240-666</p>
          
        </div>

        <div className="location">
          <h3>Apoteka Higra Sarić 2</h3>
          <p>Centar 76, Velika Obarska</p>
          <p>Telefon: 055/423-456</p>
          
        </div>
      </div>

      {/* FORMA */}
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
