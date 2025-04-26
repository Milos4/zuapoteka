import React from "react";
import "./Footer.css";
import logo from "../assets/Logo1.png";
import { FaInstagram, FaFacebook, FaMap } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* 1 sekcija: Logo i adrese */}
        <div className="footer-section-1">
          <div className="footer-logo">
            <img src={logo} alt="Logo" className="footer-logo-img" />
          </div>
          <div className="footer-address">
            <p> Agrotrzni centar Lamela B , Bijeljina</p>
            <p> Ulica 456</p>
          </div>

          {/* Mapa sa linkom ///
          <div className="footer-map">
            <Link to="/map">Pogledaj mapu</Link>
          </div>*/}
        </div>

        {/* 2 sekcija: Korisne informacije */}
        <div className="footer-section-2">
          <h3>Korisne informacije</h3>
          <ul>
            <li>
              <Link to="/o-nama">O nama</Link>
            </li>
            <li>
              <Link to="/koristnicka-podrska">Korisnicka podrška</Link>
            </li>
            <li>
              <Link to="/uslovi-koristenja">Uslovi korišćenja</Link>
            </li>
            <li>
              <Link to="/info-dostava">Informacije o dostavi</Link>
            </li>
            <li>
              <Link to="/reklamacije">Reklamacije</Link>
            </li>
            <li>
              <Link to="/pitanja">Pitanja za shop</Link>
            </li>
          </ul>
        </div>

        {/* 3 sekcija: Kontakt informacije */}
        <div className="footer-section-3">
          <h3>Kontakt</h3>
          <p>
            <strong>ZU Apoteka "HIGRA-SARIC"</strong>
          </p>
          <p>
            <strong>Broj telefona:</strong> 123-456-789
          </p>
          <p>
            <strong>Email:</strong> info@apoteka.com
          </p>
          <div className="footer-socials">
            <Link
              to="https://www.instagram.com"
              target="_blank"
              className="social-link"
            >
              <FaInstagram size={24} />
            </Link>
            <Link
              to="https://www.facebook.com"
              target="_blank"
              className="social-link"
            >
              <FaFacebook size={24} />
            </Link>
          </div>
        </div>

        <div className="footer-section-4">
          {/* Mapa sa linkom */}

          <div className="footer-map">
            <FaMap size={24} />
            <Link to="https://www.google.com/maps/?entry=wc" target="_blank">
              Pogledaj mapu
            </Link>
          </div>
        </div>
      </div>
      {/* Linija i tekst sa pravima */}
      <div className="footer-bottom">
        <hr />
        <p>&copy; 2025 ZU Apoteka "HIGRA-SARIC". Sva prava zadržana.</p>
      </div>{" "}
    </footer>
  );
};

export default Footer;
