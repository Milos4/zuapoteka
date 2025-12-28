import React, { useState, useEffect } from "react";
import "./EditProductModal.css";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...product,
    subkategorije: Array.isArray(product.subkategorije)
      ? product.subkategorije.join(", ")
      : product.subkategorije || "",
    velicine: Array.isArray(product.velicine)
      ? product.velicine.join(", ")
      : product.velicine || "", // dodano polje za velicine
    nacinUpotrebe: product.nacinUpotrebe || "",
    sastav: product.sastav || "",
    brandId: product.brandId || "", // za brand
  });

  const [brands, setBrands] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Učitaj brendove iz Firestore
  useEffect(() => {
    const fetchBrands = async () => {
      const brandsSnapshot = await getDocs(collection(db, "brands"));
      const brandsList = brandsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrands(brandsList);
    };
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewImageFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedData = { ...formData };

      if (!updatedData.naPopustu) {
        updatedData.popustProcenat = 0;
      } else {
        // Ako je na popustu, obezbedi da bude broj
        updatedData.popustProcenat =
          parseFloat(updatedData.popustProcenat) || 0;
      }

      // Upload nove slike ako postoji
      if (newImageFile) {
        const storageRef = ref(storage, `images/${product.id}`);
        await uploadBytes(storageRef, newImageFile);
        const imageUrl = await getDownloadURL(storageRef);
        updatedData.slikaURL = imageUrl;
      }

      // Konvertuj podkategorije iz stringa u niz
      if (typeof updatedData.subkategorije === "string") {
        updatedData.subkategorije = updatedData.subkategorije
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }

      // Konvertuj velicine iz stringa u niz
      if (typeof updatedData.velicine === "string") {
        updatedData.velicine = updatedData.velicine
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0);
      }

      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, updatedData);

      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Greška pri snimanju proizvoda:", err);
      alert("Greška pri snimanju proizvoda.");
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Izmeni proizvod</h2>

        <label>Šifra</label>
        <input
          type="text"
          name="sifra"
          value={formData.sifra || ""}
          onChange={handleChange}
        />

        <label>Naziv</label>
        <input
          type="text"
          name="naziv"
          value={formData.naziv || ""}
          onChange={handleChange}
        />

        <label>Cijena</label>
        <input
          type="number"
          name="cijena"
          value={formData.cijena || ""}
          onChange={handleChange}
        />

        <label>Kategorija</label>
        <input
          type="text"
          name="kategorija"
          value={formData.kategorija || ""}
          onChange={handleChange}
        />

        <label>Podkategorije (odvojene zarezom)</label>
        <input
          type="text"
          name="subkategorije"
          value={formData.subkategorije}
          onChange={handleChange}
          placeholder="npr. podkategorija1, podkategorija2"
        />

        {/* Samo ako je kategorija odjeca ili obuca */}
        {(formData.kategorija?.toLowerCase() === "odjeca" ||
          formData.kategorija?.toLowerCase() === "obuca") && (
          <>
            <label>Veličine (odvojene zarezom)</label>
            <input
              type="text"
              name="velicine"
              value={formData.velicine}
              onChange={handleChange}
              placeholder="npr. S, M, L, XL ili 40, 41, 42"
            />
          </>
        )}

        <label>Brand</label>
        <select name="brandId" value={formData.brandId} onChange={handleChange}>
          <option value="">-- Izaberite brand --</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <label>Na popustu</label>
        <input
          type="checkbox"
          name="naPopustu"
          checked={formData.naPopustu || false}
          onChange={handleChange}
        />

        {formData.naPopustu && (
          <>
            <label>Procenat popusta</label>
            <input
              type="number"
              name="popustProcenat"
              value={formData.popustProcenat || ""}
              onChange={handleChange}
            />
          </>
        )}

        <label>Na stanju</label>
        <input
          type="checkbox"
          name="naStanju"
          checked={formData.naStanju || false}
          onChange={handleChange}
        />

        <label>Opis</label>
        <textarea
          name="opis"
          value={formData.opis || ""}
          onChange={handleChange}
        />

        <label>Način upotrebe</label>
        <textarea
          name="nacinUpotrebe"
          value={formData.nacinUpotrebe || ""}
          onChange={handleChange}
        />

        <label>Sastav</label>
        <textarea
          name="sastav"
          value={formData.sastav || ""}
          onChange={handleChange}
        />

        <label>Slika</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Otkaži
          </button>
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? "Čuva se..." : "Sačuvaj"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
