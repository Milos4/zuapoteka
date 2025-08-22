// EditBrandModal.jsx
import React, { useState } from "react";
import "./EditBrandModal.css";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const EditBrandModal = ({ brand, onClose, onSave }) => {
  const [brandData, setBrandData] = useState({
    name: brand.name || "",
    imageUrl: brand.imageUrl || "",
    imagePath: brand.imagePath || "" // putanja u storage za brisanje stare slike
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setBrandData({ ...brandData, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImageFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedData = { name: brandData.name };

      if (newImageFile) {
        // Obriši staru sliku iz Storage ako postoji
        if (brandData.imagePath) {
          const oldRef = ref(storage, brandData.imagePath);
          try {
            await deleteObject(oldRef);
          } catch (err) {
            console.warn("Stara slika nije pronađena ili već obrisana", err);
          }
        }

        // Upload nove slike
        const storageRef = ref(storage, `brands/${brand.id}_${newImageFile.name}`);
        await uploadBytes(storageRef, newImageFile);
        const imageUrl = await getDownloadURL(storageRef);

        updatedData.imageUrl = imageUrl;
        updatedData.imagePath = storageRef.fullPath; // čuvamo putanju za buduće brisanje
      }

      const brandRef = doc(db, "brands", brand.id);
      await updateDoc(brandRef, updatedData);

      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Greška pri snimanju brenda:", err);
      alert("Greška pri snimanju brenda.");
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Izmeni brend</h2>

        <label>Naziv brenda</label>
        <input
          type="text"
          value={brandData.name}
          onChange={handleChange}
        />

        <label>Slika brenda</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className="brand-preview-container">
          {newImageFile ? (
            <img
              src={URL.createObjectURL(newImageFile)}
              alt="Preview"
              className="brand-preview"
            />
          ) : brandData.imageUrl ? (
            <img src={brandData.imageUrl} alt={brandData.name} className="brand-preview" />
          ) : (
            <div className="no-image">Nema slike</div>
          )}
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

export default EditBrandModal;
