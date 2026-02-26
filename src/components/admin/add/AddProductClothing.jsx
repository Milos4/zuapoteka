import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddProduct.css";
const COLOR_MAP = {
  crna: "#000000",
  bijela: "#ffffff",
  siva: "#9e9e9e",
  plava: "#1976d2",
   "tamno plava": "#0d47a1",
  crvena: "#d32f2f",
  zelena: "#388e3c",
  žuta: "#fbc02d",
  braon: "#6d4c41",
  roze: "#d81b60",
   "svjetlo roze": "#f8bbd0",
  ljubicasta: "#7b1fa2",
};

const AddProductClothing = () => {
  const [form, setForm] = useState({
    sifra: "",
    naziv: "",
    brandId: "",
    kategorija: "Obuća",
    subkategorije: "",
    cijena: "",
    naStanju: false,
    naPopustu: false,
    popustProcenat: "",
    novo: false,
    opis: "",
    slika: null,
    doplata4748: "",
    doplata4950: "",
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [preview, setPreview] = useState(null);
  const [brandovi, setBrandovi] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

const toggleColor = (color) => {
  setSelectedColors(prev =>
    prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
  );
};

  /* ====== SUBMIT ====== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.naPopustu && (form.popustProcenat < 0 || form.popustProcenat > 100)) {
      alert("Popust mora biti između 0% i 100%");
      return;
    }

    if (selectedSizes.length === 0) {
      alert("Odaberite veličine!");
      return;
    }

    if (selectedColors.length === 0) {
      alert("Odaberite boje!");
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
        velicine: selectedSizes.map(size => {
          const sizeNum = Number(size);
          const doplata =
            sizeNum >= 49
              ? Number(form.doplata4950 || 0)
              : sizeNum >= 47
                ? Number(form.doplata4748 || 0)
                : 0;
          return { broj: size, doplata };
        }),
        boje: selectedColors,
      };

      await addDoc(collection(db, "products"), newProduct);
      alert("Proizvod uspješno dodat!");

      setForm({
        sifra: "",
        naziv: "",
        brandId: "",
        kategorija: "Obuća",
        subkategorije: "",
        cijena: "",
        naStanju: false,
        naPopustu: false,
        popustProcenat: "",
        novo: false,
        opis: "",
        slika: null,
        doplata4748: "",
        doplata4950: "",
      });
      setSelectedSizes([]);
      setSelectedColors([]);
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
      <h2>Dodaj Obuću</h2>
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
          name="subkategorije"
          placeholder="Subkategorije (zarez)"
          value={form.subkategorije}
          onChange={handleChange}
        />

        {/* ====== VELIČINE ====== */}
        <label>Veličine</label>
        <div className="size-list">
          {["36","37","38","39","40","41","42","43","44","45","46","47","48","49","50"].map(size => (
            <button
              type="button"
              key={size}
              className={`size-btn ${selectedSizes.includes(size) ? "selected" : ""}`}
              onClick={() => toggleSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {/* ====== BOJE ====== */}
        <label>Boje</label>
        <div className="color-list">
          {Object.entries(COLOR_MAP).map(([name, hex]) => (
            <label key={name} className="color-item">
              <input
                type="checkbox"
                checked={selectedColors.includes(name)}
                onChange={() => toggleColor(name)}
              />
              <span className="color-dot" style={{ backgroundColor: hex }} />
              {name}
            </label>
          ))}
        </div>

        <input type="number" name="cijena" placeholder="Cijena" value={form.cijena} onChange={handleChange} required />
        <input
          type="number"
          name="doplata4748"
          placeholder="Doplata za brojeve 47-48 (BAM)"
          value={form.doplata4748}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="doplata4950"
          placeholder="Doplata za brojeve 49-50 (BAM)"
          value={form.doplata4950}
          onChange={handleChange}
          min="0"
          step="0.01"
        />

        <label><input type="checkbox" name="naStanju" checked={form.naStanju} onChange={handleChange} /> Na stanju</label>
        <label><input type="checkbox" name="naPopustu" checked={form.naPopustu} onChange={handleChange} /> Na popustu</label>

        {form.naPopustu && (
          <input type="number" name="popustProcenat" placeholder="Popust %" value={form.popustProcenat} onChange={handleChange} min={0} max={100} />
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
