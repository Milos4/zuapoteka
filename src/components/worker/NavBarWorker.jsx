import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./NavBarWorker.css";
import newOrderSound from "../../assets/sound/new-notification.wav";

const NavBarWorker = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState(0);
  const prevPendingRef = useRef(0);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(newOrderSound);
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("status", "==", "Poručeno"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCount = snapshot.size;
      if (newCount > prevPendingRef.current) {
        // Ako je novi broj veći od prethodnog, pusti zvuk
        audioRef.current
          .play()
          .catch((err) => console.log("Zvuk nije dozvoljen:", err));
      }
      prevPendingRef.current = newCount;
      setPendingOrders(newCount);
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
        <Link to="/radnik/popusti-po-brendu">Popusti</Link>
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
