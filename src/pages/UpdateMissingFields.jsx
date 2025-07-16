import { useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const UpdateMissingFields = () => {
  useEffect(() => {
    const updateFields = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const updates = snapshot.docs.map(async (document) => {
        const data = document.data();
        const updates = {};

        if (data.nacinUpotrebe === undefined) updates.nacinUpotrebe = "";
        if (data.sastav === undefined) updates.sastav = "";

        if (Object.keys(updates).length > 0) {
          const ref = doc(db, "products", document.id);
          await updateDoc(ref, updates);
          console.log(`Updated: ${document.id}`);
        }
      });

      await Promise.all(updates);
      console.log("Svi proizvodi ažurirani!");
    };

    updateFields();
  }, []);

  return null; // Ne prikazuje ništa
};

export default UpdateMissingFields;
