import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddProduct.css";

const AddProductClothing = () => {
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
    slika: null,
    velicine: "", // samo za odjeću
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
        const storageRef = ref(storage, `products/${Date.now()}-${form.slika.name}`);
        await uploadBytes(storageRef, form.slika);
        slikaURL = await getDownloadURL(storageRef);
      }

      const newProduct = {
        sifra: form.sifra,
        naziv: form.naziv,
        brandId: form.brandId,
        kategorija: form.kategorija,
        subkategorije: form.subkategorije
          ? form.subkategorije.split(",").map((s) => s.trim().toLowerCase())
          : [],
        cijena: parseFloat(form.cijena),
        naStanju: form.naStanju,
        naPopustu: form.naPopustu,
        popustProcenat: form.naPopustu ? parseInt(form.popustProcenat) : 0,
        novo: form.novo,
        opis: form.opis,
        slikaURL,
        brojNarudzbinaUkupno: 0,
        brojNarudzbinaMjesec: 0,
        velicine: form.kategorija.toLowerCase() === "odjeca" && form.velicine
          ? form.velicine.split(",").map((v) => v.trim().toUpperCase()).filter((v) => v !== "")
          : [],
      };

      console.log("Sending to Firestore:", newProduct);

      await addDoc(collection(db, "products"), newProduct); // ovde ide products
      alert("Proizvod uspješno dodat!");

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
        slika: null,
        velicine: "",
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
        <input type="text" name="sifra" placeholder="Šifra proizvoda" value={form.sifra} onChange={handleChange} required />
        <input type="text" name="naziv" placeholder="Naziv proizvoda" value={form.naziv} onChange={handleChange} required />

        <select name="brandId" value={form.brandId} onChange={handleChange} required>
          <option value="">Izaberi brend</option>
          {brandovi.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>

        <input type="text" name="kategorija" placeholder="Kategorija (npr. Odjeca, Patike)" value={form.kategorija} onChange={handleChange} required />
        <input type="text" name="subkategorije" placeholder="Subkategorije (odvojene zarezom)" value={form.subkategorije} onChange={handleChange} />

        {form.kategorija.toLowerCase() === "odjeca" && (
          <input type="text" name="velicine" placeholder="Veličine (npr. S,M,L)" value={form.velicine} onChange={handleChange} required />
        )}

        <input type="number" name="cijena" placeholder="Cijena" value={form.cijena} onChange={handleChange} required />

        <label><input type="checkbox" name="naStanju" checked={form.naStanju} onChange={handleChange} /> Na stanju</label>
        <label><input type="checkbox" name="naPopustu" checked={form.naPopustu} onChange={handleChange} /> Na popustu</label>

        {form.naPopustu && (
          <input type="number" name="popustProcenat" placeholder="Popust (%)" value={form.popustProcenat} onChange={handleChange} min={0} max={100} />
        )}

        <label><input type="checkbox" name="novo" checked={form.novo} onChange={handleChange} /> Novo</label>
        <textarea name="opis" placeholder="Opis proizvoda" value={form.opis} onChange={handleChange} />

        {preview && <img src={preview} alt="Preview" style={{ maxWidth: "150px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />}
        <input type="file" name="slika" accept="image/*" onChange={handleChange} />

        <button type="submit" disabled={uploading}>{uploading ? "Dodavanje..." : "Dodaj proizvod"}</button>
      </form>
    </div>
  );
};

export default AddProductClothing;
