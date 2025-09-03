// EditCategoryModal.jsx
import React, { useState } from "react";

import { doc, updateDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

const EditCategoryModal = ({ category, onClose, onSave }) => {
  const [catData, setCatData] = useState({
    naziv: category.naziv || "",
    subkategorije: category.subkategorije || []
  });
  const [newSub, setNewSub] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddSub = () => {
    if (newSub.trim() && !catData.subkategorije.includes(newSub)) {
      setCatData({ ...catData, subkategorije: [...catData.subkategorije, newSub] });
      setNewSub("");
    }
  };

  const handleRemoveSub = (sub) => {
    setCatData({
      ...catData,
      subkategorije: catData.subkategorije.filter((s) => s !== sub),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const oldNaziv = category.naziv;
      const newNaziv = catData.naziv;

      // 1. Update kategorije
      const catRef = doc(db, "categories", category.id);
      await updateDoc(catRef, {
        naziv: newNaziv,
        subkategorije: catData.subkategorije,
      });

      // 2. Ako se naziv promijenio -> update u svim proizvodima
      if (oldNaziv !== newNaziv) {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const batch = writeBatch(db);

        productsSnapshot.forEach((docSnap) => {
          const prodData = docSnap.data();
          if (prodData.kategorija === oldNaziv) {
            batch.update(docSnap.ref, { kategorija: newNaziv });
          }
        });

        await batch.commit();
      }

      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Greška pri snimanju kategorije:", err);
      alert("Greška pri snimanju kategorije.");
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Izmeni kategoriju</h2>

        <label>Naziv kategorije</label>
        <input
          type="text"
          value={catData.naziv}
          onChange={(e) => setCatData({ ...catData, naziv: e.target.value })}
        />

        <label>Subkategorije</label>
        <div className="sub-list">
          {catData.subkategorije.map((sub, i) => (
            <div key={i} className="sub-item">
              <span>{sub}</span>
              <button onClick={() => handleRemoveSub(sub)}>Obriši</button>
            </div>
          ))}
        </div>

        <div className="sub-add">
          <input
            type="text"
            value={newSub}
            onChange={(e) => setNewSub(e.target.value)}
            placeholder="Nova subkategorija"
          />
          <button onClick={handleAddSub}>Dodaj</button>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Otkaži</button>
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? "Čuva se..." : "Sačuvaj"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
