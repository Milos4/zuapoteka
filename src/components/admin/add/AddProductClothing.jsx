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
    velicine: "",
    boja: "",
  });

  const [preview, setPreview] = useState(null);
  const [brandovi, setBrandovi] = useState([]);
  const [uploading, setUploading] = useState(false);

  const kategorijaLower = form.kategorija.toLowerCase();
  const imaVelicine = kategorijaLower === "odjeca" || kategorijaLower === "obuca";
  const jeObuca = kategorijaLower === "obuca";

  /* ====== FETCH BRANDOVI ====== */
  useEffect(() => {
    const fetchBrandovi = async () => {
      const snapshot = await getDocs(collection(db, "brands"));
      setBrandovi(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBrandovi();
  }, []);

  /* ====== IMAGE PREVIEW ====== */
  useEffect(() => {
    if (!form.slika) return setPreview(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(form.slika);
  }, [form.slika]);

  /* ====== HANDLE CHANGE ====== */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm(prev => ({ ...prev, slika: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  /* ====== SUBMIT ====== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.naPopustu && (form.popustProcenat < 0 || form.popustProcenat > 100)) {
      alert("Popust mora biti između 0% i 100%");
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

      const cijenaBroj = Number(form.cijena);

if (isNaN(cijenaBroj) || cijenaBroj <= 0) {
  alert("Unesite ispravnu cijenu");
  setUploading(false);
  return;
}

      const newProduct = {
        sifra: form.sifra,
        naziv: form.naziv,
        brandId: form.brandId,
        kategorija: form.kategorija,
        subkategorije: form.subkategorije
          ? form.subkategorije.split(",").map(s => s.trim().toLowerCase())
          : [],
        cijena: cijenaBroj,
        naStanju: form.naStanju,
        naPopustu: form.naPopustu,
        popustProcenat: form.naPopustu ? parseInt(form.popustProcenat) : 0,
        novo: form.novo,
        opis: form.opis,
        slikaURL,
        brojNarudzbinaUkupno: 0,
        brojNarudzbinaMjesec: 0,
        velicine:
          imaVelicine && form.velicine
            ? form.velicine
                .split(",")
                .map(v => v.trim().toUpperCase())
                .filter(v => v !== "")
            : [],
           boje:
  jeObuca && form.boja
    ? form.boja.split(",").map(b => b.trim().toLowerCase())
    : [],
      };
  

      await addDoc(collection(db, "products"), newProduct);
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
        boja: "",
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju proizvoda");
    } finally {
      setUploading(false);
    }
  };

  /* ====== JSX ====== */
  return (
    <div className="add-product-container">
      <h2>Dodaj Proizvod</h2>

      <form onSubmit={handleSubmit} className="add-product-form">
        <input name="sifra" placeholder="Šifra proizvoda" value={form.sifra} onChange={handleChange} required />
        <input name="naziv" placeholder="Naziv proizvoda" value={form.naziv} onChange={handleChange} required />

        <select name="brandId" value={form.brandId} onChange={handleChange} required>
          <option value="">Izaberi brend</option>
          {brandovi.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <input
          name="kategorija"
          placeholder="Kategorija (odjeca ili obuca)"
          value={form.kategorija}
          onChange={handleChange}
          required
        />

        <input
          name="subkategorije"
          placeholder="Subkategorije (zarez)"
          value={form.subkategorije}
          onChange={handleChange}
        />

        {/* ====== VELIČINE ====== */}
        {imaVelicine && (
          <input
            name="velicine"
            placeholder={
              kategorijaLower === "obuca"
                ? "Veličine (npr. 40,41,42)"
                : "Veličine (npr. S,M,L)"
            }
            value={form.velicine}
            onChange={handleChange}
            required
          />
        )}
        {jeObuca && (
  <input
    name="boja"
    placeholder="Boje (npr. crna, bijela)"
    value={form.boja}
    onChange={handleChange}
    required
  />
)}

        <input type="number" name="cijena" placeholder="Cijena" value={form.cijena} onChange={handleChange} required />

        <label><input type="checkbox" name="naStanju" checked={form.naStanju} onChange={handleChange} /> Na stanju</label>
        <label><input type="checkbox" name="naPopustu" checked={form.naPopustu} onChange={handleChange} /> Na popustu</label>

        {form.naPopustu && (
          <input
            type="number"
            name="popustProcenat"
            placeholder="Popust %"
            value={form.popustProcenat}
            onChange={handleChange}
            min={0}
            max={100}
          />
        )}

        <label><input type="checkbox" name="novo" checked={form.novo} onChange={handleChange} /> Novo</label>

        <textarea name="opis" placeholder="Opis proizvoda" value={form.opis} onChange={handleChange} />

        {preview && <img src={preview} alt="preview" style={{ maxWidth: 150, borderRadius: 8 }} />}

        <input type="file" accept="image/*" onChange={handleChange} />

        <button type="submit" disabled={uploading}>
          {uploading ? "Dodavanje..." : "Dodaj proizvod"}
        </button>
      </form>
    </div>
  );
};

export default AddProductClothing;
