// WorkerProductsPage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./WorkerProductsPage.css";

const PAGE_SIZE = 20;

const WorkerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [filterOnSale, setFilterOnSale] = useState(false);
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
    fetchAllProducts();
  }, []);

  const fetchBrands = async () => {
    try {
      const snapshot = await getDocs(collection(db, "brands"));
      const brandList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBrands(brandList);
    } catch (err) {
      console.error("Greška prilikom učitavanja brendova", err);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, "products"), orderBy("naziv")));
      const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllProducts(all);
      setFiltered(all);
    } catch (err) {
      console.error("Greška pri učitavanju proizvoda", err);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    let filtered = allProducts;

    if (searchCode.trim() !== "") {
      filtered = filtered.filter((p) => p.sifra === searchCode.trim());
    } else {
      if (searchName.trim().length >= 3) {
        const nameLower = searchName.toLowerCase();
        filtered = filtered.filter(
          (p) => p.naziv && p.naziv.toLowerCase().includes(nameLower)
        );
      }
      if (brandFilter) {
        filtered = filtered.filter((p) => p.brandId === brandFilter);
      }
      if (filterOnSale) {
        filtered = filtered.filter((p) => p.naPopustu);
      }
      if (filterOutOfStock) {
        filtered = filtered.filter((p) => p.naStanju === false);
      }
      if (categoryFilter.trim() !== "") {
        filtered = filtered.filter((p) =>
          p.kategorija?.toLowerCase().includes(categoryFilter.toLowerCase())
        );
      }
    }

    setFiltered(filtered);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const handleEdit = (productId) => {
    navigate(`/worker/edit-product/${productId}`);
  };

  return (
    <div className="products-wrapper">
      <h1>Pretraga proizvoda</h1>
      <div className="search-filters">
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Šifra (tačan unos)"
        />
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Naziv (min 3 slova)"
        />
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="">Svi brendovi</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          placeholder="Kategorija (npr. Mama i bebe)"
        />
        <label>
          <input
            type="checkbox"
            checked={filterOnSale}
            onChange={() => setFilterOnSale(!filterOnSale)}
          /> Na popustu
        </label>
        <label>
          <input
            type="checkbox"
            checked={filterOutOfStock}
            onChange={() => setFilterOutOfStock(!filterOutOfStock)}
          /> Nije na stanju
        </label>
        <button className="btn-load-more" onClick={handleSearch}>
          Pretraži
        </button>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : filtered.length === 0 ? (
        <p>Nema pronađenih proizvoda.</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Slika</th>
              <th>Naziv</th>
              <th>Šifra</th>
              <th>Popust</th>
              <th>Na stanju</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, visibleCount).map((p) => (
              <tr key={p.id}>
                <td>
                  {p.slikaURL ? (
                    <img src={p.slikaURL} alt={p.naziv} className="product-img" />
                  ) : (
                    <div className="no-image">Nema slike</div>
                  )}
                </td>
                <td>{p.naziv}</td>
                <td>{p.sifra}</td>
                <td>
                  {p.naPopustu
                    ? `${p.popustProcenat ?? 0}%`
                    : "Ne"}
                </td>
                <td>{p.naStanju ? "Da" : "Ne"}</td>
                <td>
                  <button onClick={() => handleEdit(p.id)} className="btn-secondary">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {visibleCount < filtered.length && (
        <button className="btn-load-more" onClick={handleLoadMore}>
          Učitaj još
        </button>
      )}
    </div>
  );
};

export default WorkerProductsPage;
