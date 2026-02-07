import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddProduct.css";

const AddProduct = () => {

  const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("");
const [availableSubcategories, setAvailableSubcategories] = useState([]);
const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [form, setForm] = useState({
    sifra: "",
    naziv: "",
    brandId: "",
    kategorija: "",
    subkategorije: "",
    cijena: "",
    naStanju: false,
    naPopustu: false,
    popustProcenat: "",
    novo: false,
    opis: "",
    nacinUpotrebe: "",
    sastav: "",
    slika: null,
  });

  const [preview, setPreview] = useState(null);
  const [brandovi, setBrandovi] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBrandovi = async () => {
      const snapshot = await getDocs(collection(db, "brands"));
      setBrandovi(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchBrandovi();
  }, []);

  useEffect(() => {
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "kategorije"));
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(list);
  };

  fetchCategories();
}, []);

  useEffect(() => {
    if (form.slika) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(form.slika);
    } else {
      setPreview(null);
    }
  }, [form.slika]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, slika: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.naPopustu && (form.popustProcenat < 0 || form.popustProcenat > 100)) {
      alert("Popust mora biti između 0% i 100%.");
      return;
    }

    try {
      setUploading(true);

      let slikaURL = "";
      if (form.slika) {
        const storageRef = ref(storage, `image/${form.slika.name}`);
        await uploadBytes(storageRef, form.slika);
        slikaURL = await getDownloadURL(storageRef);
      }

      const categoryObj = categories.find(c => c.id === selectedCategory);

const newProduct = {
  sifra: form.sifra,
  naziv: form.naziv,
  brandId: form.brandId,

  kategorijaId: selectedCategory,
  kategorija: categoryObj?.naziv || "",

  subkategorije: selectedSubcategories,

  cijena: parseFloat(form.cijena),
  naStanju: form.naStanju,
  naPopustu: form.naPopustu,
  popustProcenat: form.naPopustu ? parseInt(form.popustProcenat) : 0,
  novo: form.novo,
  opis: form.opis,
  nacinUpotrebe: form.nacinUpotrebe,
  sastav: form.sastav,
  slikaURL,
  brojNarudzbinaUkupno: 0,
  brojNarudzbinaMjesec: 0,
};
      await addDoc(collection(db, "products"), newProduct);
      alert("Proizvod uspešno dodat!");

      setForm({
        sifra: "",
        naziv: "",
        brandId: "",
        kategorija: "",
        subkategorije: "",
        cijena: "",
        naStanju: false,
        naPopustu: false,
        popustProcenat: "",
        novo: false,
        opis: "",
        nacinUpotrebe: "",
        sastav: "",
        slika: null,    
        
      });
      setPreview(null);
    } catch (error) {
      console.error("Greška pri dodavanju proizvoda:", error);
      alert("Došlo je do greške.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Dodaj Proizvod</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          name="sifra"
          placeholder="Šifra proizvoda"
          value={form.sifra}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="naziv"
          placeholder="Naziv proizvoda"
          value={form.naziv}
          onChange={handleChange}
          required
        />

        <select
          name="brandId"
          value={form.brandId}
          onChange={handleChange}
          required
        >
          <option value="">Izaberi brend</option>
          {brandovi.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

      <select
  value={selectedCategory}
  required
  onChange={(e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);

    const cat = categories.find(c => c.id === catId);
    setAvailableSubcategories(cat?.subkategorije || []);
    setSelectedSubcategories([]);
  }}
>
  <option value="">Izaberi kategoriju</option>
  {categories.map(c => (
    <option key={c.id} value={c.id}>
      {c.naziv}
    </option>
  ))}
</select>

{availableSubcategories.length > 0 && (
  <div className="subcategories-box">
    {availableSubcategories.map(sub => (
      <label key={sub}>
        <input
          type="checkbox"
          checked={selectedSubcategories.includes(sub)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedSubcategories(prev => [...prev, sub]);
            } else {
              setSelectedSubcategories(prev =>
                prev.filter(s => s !== sub)
              );
            }
          }}
        />
        {sub}
      </label>
    ))}
  </div>
)}
        <input
          type="number"
          name="cijena"
          placeholder="Cijena"
          value={form.cijena}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="naStanju"
            checked={form.naStanju}
            onChange={handleChange}
          />
          Na stanju
        </label>

        <label>
          <input
            type="checkbox"
            name="naPopustu"
            checked={form.naPopustu}
            onChange={handleChange}
          />
          Na popustu
        </label>

        {form.naPopustu && (
          <input
            type="number"
            name="popustProcenat"
            placeholder="Popust (%)"
            value={form.popustProcenat}
            onChange={handleChange}
            min={0}
            max={100}
          />
        )}

        <label>
          <input
            type="checkbox"
            name="novo"
            checked={form.novo}
            onChange={handleChange}
          />
          Novo
        </label>

        <textarea
          name="opis"
          placeholder="Opis proizvoda"
          value={form.opis}
          onChange={handleChange}
        />

        <textarea
          name="nacinUpotrebe"
          placeholder="Način upotrebe"
          value={form.nacinUpotrebe}
          onChange={handleChange}
        />

        <textarea
          name="sastav"
          placeholder="Sastav"
          value={form.sastav}
          onChange={handleChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "150px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        )}

        <input
          type="file"
          name="slika"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Dodavanje..." : "Dodaj proizvod"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
