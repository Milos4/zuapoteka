import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
} from "firebase/firestore";
import "./WorkerBrandDiscountPage.css";

const WorkerBrandDiscountPage = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);

  /* LOAD BRANDS */
  useEffect(() => {
    const fetchBrands = async () => {
      const snap = await getDocs(collection(db, "brands"));
      setBrands(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    };
    fetchBrands();
  }, []);

  /* LOAD PRODUCTS BY BRAND */
  const fetchProducts = async (brandId) => {
    setLoading(true);
    const q = query(
      collection(db, "products"),
      where("brandId", "==", brandId)
    );
    const snap = await getDocs(q);
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setSelectedProducts([]);
    setLoading(false);
  };

  /* SELECT */
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedProducts(products.map((p) => p.id));
  };

  const deselectAll = () => {
    setSelectedProducts([]);
  };

  /* APPLY DISCOUNT */
const applyDiscount = async () => {
  if (selectedProducts.length === 0) {
    alert("Izaberi proizvode");
    return;
  }

  const discountNumber = Number(discount);

  if (isNaN(discountNumber) || discountNumber < 0 || discountNumber > 90) {
    alert("Popust mora biti između 0 i 90%");
    return;
  }

  const batch = writeBatch(db);

  selectedProducts.forEach((id) => {
    if (discountNumber === 0) {
      // UKLANJANJE POPUSTA
      batch.update(doc(db, "products", id), {
        naPopustu: false,
        popustProcenat: 0,
      });
    } else {
      // POSTAVLJANJE POPUSTA
      batch.update(doc(db, "products", id), {
        naPopustu: true,
        popustProcenat: discountNumber,
      });
    }
  });

  await batch.commit();

  alert(
    discountNumber === 0
      ? "Popust uklonjen sa proizvoda"
      : "Popust uspešno primenjen"
  );

  fetchProducts(selectedBrand);
};

  return (
    <div className="brand-discount-wrapper">
      <h1>Popusti po brendu</h1>

      <select
        value={selectedBrand}
        onChange={(e) => {
          setSelectedBrand(e.target.value);
          fetchProducts(e.target.value);
        }}
      >
        <option value="">Izaberi brend</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Učitavanje proizvoda...</p>
      ) : products.length === 0 ? (
        <p>Nema proizvoda za izabrani brend.</p>
      ) : (
        <>
          <div className="bulk-actions">
            <button onClick={selectAll}>Selektuj sve</button>
            <button onClick={deselectAll} className="secondary">
              Poništi selekciju
            </button>

           <input
  type="number"
  placeholder="Popust % (0 = nema)"
  value={discount}
  onChange={(e) => setDiscount(e.target.value)}
/>

            <button onClick={applyDiscount} className="apply">
              Primeni popust
            </button>
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th></th>
                <th>Naziv</th>
                <th>Šifra</th>
                <th>Popust</th>
                <th>Na stanju</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                  </td>
                  <td>{p.naziv}</td>
                  <td>{p.sifra}</td>
                  <td>{p.naPopustu ? `${p.popustProcenat}%` : "Nema"}</td>
                  <td>{p.naStanju ? "Da" : "Ne"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default WorkerBrandDiscountPage;
