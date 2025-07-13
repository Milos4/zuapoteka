// src/components/worker/WorkerRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const WorkerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isWorker, setIsWorker] = useState(false);

  useEffect(() => {
    const checkWorker = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setIsWorker(role === "radnik");
      }

      setLoading(false);
    };

    checkWorker();
  }, []);

  if (loading) return null; // Možeš staviti loader ako želiš

  if (!auth.currentUser || !isWorker) {
    return <Navigate to="/pocetna" replace />;
  }

  return children;
};

export default WorkerRoute;
