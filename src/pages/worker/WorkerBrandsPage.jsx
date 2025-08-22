// WorkerBrandsPage.jsx
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import EditBrandModal from "../../components/worker/EditBrandModal";
import "./WorkerBrandsPage.css";

const PAGE_SIZE = 20;

const WorkerBrandsPage = () => {
  const [allBrands, setAllBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "brands"));
      const brandList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllBrands(brandList);
      setBrands(brandList);
    } catch (err) {
      console.error("Greška prilikom učitavanja brendova", err);
    }
    setLoading(false);
  };

  useEffect(() => {
  const timeout = setTimeout(() => {
    if (searchName.trim() === "") {
      setBrands(allBrands);
    } else {
      const filtered = allBrands.filter((b) =>
        b.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setBrands(filtered);
    }
    setVisibleCount(PAGE_SIZE);
  }, 400); // 400ms debounce

  return () => clearTimeout(timeout);
}, [searchName, allBrands]);

  

  const deleteBrand = async (brand) => {
    if (!window.confirm(`Da li sigurno želiš da obrišeš brend "${brand.name}" i sve njegove proizvode?`)) return;

    try {
      // Obriši sliku brenda iz Storage (ako postoji)
      if (brand.imageURL && brand.imagePath) {
        const imageRef = ref(storage, brand.imagePath);
        await deleteObject(imageRef).catch((err) => console.log("Slika brenda nije pronađena", err));
      }

      // Obriši sve proizvode koji imaju ovaj brandId
      const productsSnapshot = await getDocs(collection(db, "products"));
      const batchDeletes = productsSnapshot.docs
        .filter((p) => p.data().brandId === brand.id)
        .map((p) => deleteDoc(doc(db, "products", p.id)));
      await Promise.all(batchDeletes);

      // Obriši brend
      await deleteDoc(doc(db, "brands", brand.id));
      alert("Brend i svi njegovi proizvodi obrisani.");
      fetchBrands();
    } catch (err) {
      console.error("Greška pri brisanju brenda", err);
      alert("Došlo je do greške prilikom brisanja.");
    }
  };

  return (
    <div className="brands-wrapper">
      <h1>Upravljanje brendovima</h1>

      <div className="search-filters">
        <input
          type="text"
          placeholder="Pretraži po nazivu"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : brands.length === 0 ? (
        <p>Nema brendova.</p>
      ) : (
        <>
          <table className="brands-table">
            <thead>
              <tr>
                <th>Slika</th>
                <th>Naziv</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {brands.slice(0, visibleCount).map((b) => (
                <tr key={b.id}>
                  <td>
                    {b.imageUrl ? (
                      <img src={b.imageUrl} alt={b.name} className="brand-img" />
                    ) : (
                      <div className="no-image">Nema slike</div>
                    )}
                  </td>
                  <td>{b.name}</td>
                  <td>
                    <button onClick={() => setSelectedBrand(b)} className="btn-secondary">
                      Edit
                    </button>
                    <button onClick={() => deleteBrand(b)} className="btn-delete">
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleCount < brands.length && (
            <button
              className="btn-load-more"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            >
              Učitaj još
            </button>
          )}
        </>
      )}

      {selectedBrand && (
        <EditBrandModal
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
          onSave={fetchBrands}
        />
      )}
    </div>
  );
};

export default WorkerBrandsPage;
