import React from "react";
import "./Footer.css";
import logo from "../assets/Logo1.png";
import mapa from "../assets/mapa.png";
import { FaInstagram, FaMap } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* 1 sekcija: Logo i adresa */}
        <div className="footer-section-1">
          <img src={logo} alt="Logo" className="footer-logo-img" />
          <div className="footer-address">
            <p>Agrotržni centar Lamela B, Bijeljina</p>
            <p>Ulica 456</p>
          </div>
        </div>

        {/* 2 sekcija: Korisne informacije */}
        <div className="footer-section-2">
          <h3>Korisne informacije</h3>
          <ul>
            <li><Link to="/o-nama">O nama</Link></li>
            <li><Link to="/koristnicka-podrska">Korisnička podrška</Link></li>
            <li><Link to="/uslovi-koristenja">Uslovi korišćenja</Link></li>
            <li><Link to="/info-dostava">Informacije o dostavi</Link></li>
            <li><Link to="/reklamacije">Reklamacije</Link></li>
            <li><Link to="/pitanja">Pitanja za shop</Link></li>
          </ul>
        </div>

        {/* 3 sekcija: Kontakt */}
        <div className="footer-section-3">
          <h3>Kontakt</h3>
          <p><strong>ZU Apoteka "HIGRA-SARIC"</strong></p>
          <p><strong>Telefon:</strong> 0038755240666</p>
          <p><strong>Email:</strong> info@apoteka-higrasaric.ba</p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/apoteka_higra_saric/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* 4 sekcija: Mapa */}
        <div className="footer-section-4">
          <a
            href="https://www.google.com/maps/place/Apoteka+Higra+Sari%C4%87/@44.763852,19.1789828,18z/data=!4m14!1m7!3m6!1s0x475bef226c1ce505:0x64e06606082d7ed5!2sAgro-tr%C5%BEni+centar+Knez+Ivo+od+Semberije!8m2!3d44.763073!4d19.1783292!16s%2Fg%2F11j0sr7jb0!3m5!1s0x475bef17ac7aeac1:0x97a8dcf7eb5e9e8e!8m2!3d44.763823!4d19.1790147!16s%2Fg%2F11ytxsk7kp?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-link"
          >
            <img
              src={mapa}
              alt="Pronađi nas na Google mapama"
              className="footer-map-img"
            />
            <div className="footer-map-text">
              <FaMap size={18} />
              <span>Pronađi nas na mapi</span>
            </div>
          </a>
        </div>
      </div>

      {/* Donji dio */}
      <div className="footer-bottom">
        <hr />
        <p>&copy; 2025 ZU Apoteka "HIGRA-SARIC". Sva prava zadržana.</p>
      </div>
    </footer>
  );
};

export default Footer;