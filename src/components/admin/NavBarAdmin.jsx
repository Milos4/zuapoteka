import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./NavBarAdmin.css";

const NavBarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/prijava");
  };

  return (
    <nav className="navbar-admin">
      <div className="admin-left">
        <Link to="/admin/proizvodi">Proizvodi</Link>
        <Link to="/admin/korisnici">Korisnici</Link>
        <Link to="/admin/popusti">Popusti</Link>
        <Link to="/admin/nastanju">Na stanju</Link>
      </div>

      <div className="admin-right">
        <span className="logout-link" onClick={handleLogout}>
          Odjavi se
        </span>
      </div>
    </nav>
  );
};

export default NavBarAdmin;
