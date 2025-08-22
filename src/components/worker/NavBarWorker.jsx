import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./NavBarWorker.css";

const NavBarWorker = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // Pravimo query za narudžbine koje imaju status 'poruceno'
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("status", "==", "Poručeno"));

    // Slušamo u realnom vremenu
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingOrders(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/prijava");
  };

  return (
    <nav className="navbar-worker">
      <div className="worker-left">
        <Link to="/radnik/porudzbine">Porudžbine</Link>
        <Link to="/radnik/proizvodi">Proizvodi</Link>
        <Link to="/radnik/brendovi">Brendovi</Link>
        
      </div>

      <div className="worker-right">
  <div className="logout-wrapper" onClick={handleLogout}>
    {pendingOrders > 0 && <span className="badge1">{pendingOrders}</span>}
    <span className="logout-text">Odjavi se</span>
  </div>
</div>
    </nav>
  );
};

export default NavBarWorker;
