import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./NavBarWorker.css"; // napravi CSS ako želiš

const NavBarWorker = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/prijava");
  };

  return (
    <nav className="navbar-worker">
      <div className="worker-left">
        <Link to="/radnik/porudzbine">Porudžbine</Link>
        <Link to="/radnik/proizvodi">Proizvodi</Link>
      </div>

      <div className="worker-right">
        <span className="logout-link" onClick={handleLogout}>
          Odjavi se
        </span>
      </div>
    </nav>
  );
};

export default NavBarWorker;
