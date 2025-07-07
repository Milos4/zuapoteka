// src/components/AdminRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setIsAdmin(role === "admin");
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return null; // ili loader

  if (!auth.currentUser || !isAdmin) {
    return <Navigate to="/pocetna" replace />;
  }

  return children;
};

export default AdminRoute;
