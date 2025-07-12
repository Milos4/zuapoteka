// src/admin/pages/add/AddBrand.jsx
import React, { useState } from "react";
import { db, storage } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddBrand.css";

const AddBrand = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !imageFile) {
      alert("Popunite sva polja.");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `brands/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "brands"), {
        name,
        imageUrl,
        createdAt: new Date(),
      });

      alert("Brend uspešno dodat!");
      setName("");
      setImageFile(null);
    } catch (error) {
      console.error("Greška prilikom dodavanja brenda:", error);
      alert("Došlo je do greške.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-brand-container">
      <h2>Dodaj novi brend</h2>
      <form onSubmit={handleSubmit} className="add-brand-form">
        <input
          type="text"
          placeholder="Ime brenda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Dodavanje..." : "Dodaj brend"}
        </button>
      </form>
    </div>
  );
};

export default AddBrand;
