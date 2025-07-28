import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { useCart } from "../context/CartContext";

import DiscountProduct from "../components/SpecialOffers/DiscountProduct";
import RegularProduct from "../components/SpecialOffers/RegularProduct";
import NewProduct from "../components/SpecialOffers/NewProduct";
import Popup from "../components/Popup";
import "./ShopPage.css";
import { useNavigate, useLocation } from "react-router-dom";

const PAGE_SIZE = 20;

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [filterNew, setFilterNew] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const { addToCart } = useCart();

 useEffect(() => {
  const params = new URLSearchParams(location.search);

  const brandParams = params.getAll("brand"); // npr. ["Nivea", "Bebi program"]
  const kategorija = params.get("kategorija");
  const naPopustu = params.get("naPopustu");
  const novo = params.get("novo");

  const applyFilters = async () => {
    if (brandParams.length > 0 && brands.length > 0) {
      // Pronađi ID-eve na osnovu imena brenda
      const matchingIds = brands
        .filter((b) => brandParams.includes(b.name))
        .map((b) => b.id);
      setSelectedBrands(matchingIds);
    }

    if (kategorija) setSelectedCategories([kategorija]);
    if (naPopustu === "true") setFilterDiscount(true);
    if (novo === "true") setFilterNew(true);
  };

  applyFilters();
}, [location.search, brands]);


  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "wishlist"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const ids = snapshot.docs.map((doc) => doc.data().productId);
        setWishlistItems(ids);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(list);
  };

  const fetchBrands = async () => {
    const snapshot = await getDocs(collection(db, "brands"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    setBrands(list);
  };

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "kategorije"));
    const catObj = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      catObj[data.naziv] = data.subkategorije?.filter((s) => s.trim() !== "") || [];
    });
    setCategories(catObj);
  };

  const shortenDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.slice(0, 4).join(" ") + (words.length > 4 ? "..." : "");
  };

  const filtered = products.filter((p) => {
    if (search && !p.naziv.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brandId)) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.kategorija)) return false;
    if (selectedSubcategories.length > 0 && selectedCategories.includes(p.kategorija)) {
      if (!p.subkategorije || !selectedSubcategories.every((sub) => p.subkategorije.includes(sub))) {
        return false;
      }
    }
    if (filterDiscount && !p.naPopustu) return false;
    if (filterNew && !p.novo) return false;
    return true;
  });

  const handleCategoryToggle = (kat) => {
    setSelectedCategories((prev) =>
      prev.includes(kat) ? prev.filter((k) => k !== kat) : [...prev, kat]
    );
  };

  const handleSubcategoryToggle = (sub) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleBrandToggle = (id) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleAddToFavorite = async (product) => {
    if (user) {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setPopupMessage("Ovaj proizvod je već u listi želja!");
        setShowPopup(true);
        return;
      }

      const wishlistData = {
        userId: user.uid,
        productId: product.id,
        naziv: product.naziv,
        cijena: product.cijena,
        slikaURL: product.slikaURL,
        kategorija: product.kategorija || "Nepoznato",
        naPopustu: product.naPopustu || false,
        popustProcenat: product.popustProcenat || 0,
        brandImageUrl: product.brandImageUrl || "",
        dateAdded: new Date().toISOString(),
      };

      await addDoc(collection(db, "wishlist"), wishlistData);
      setWishlistItems((prev) => [...prev, product.id]);
      setPopupMessage("Proizvod je dodat u listu želja!");
    } else {
      setPopupMessage("Morate biti ulogovani da biste dodali u listu želja.");
    }
    setShowPopup(true);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderProduct = (p) => {
    const desc = shortenDescription(p.opis);
    const inWishlist = wishlistItems.includes(p.id);
    const common = {
      key: p.id,
      image: p.slikaURL,
      name: p.naziv,
      description: desc,
price: Number(
  typeof p.cijena === "string" ? p.cijena.replace(",", ".") : p.cijena
).toFixed(2),      onView: () => handleViewProduct(p.id),
      onAddToCart: () => addToCart(p),
      onAddToFavorites: () => handleAddToFavorite(p),
      inWishlist,
    };

    if (p.naPopustu) {
    const parsedCijena = Number(
  typeof p.cijena === "string" ? p.cijena.replace(",", ".") : p.cijena
);
const stara = parsedCijena / (1 - (p.popustProcenat || 0) / 100);
return <DiscountProduct {...common} oldPrice={stara.toFixed(2)} />;
    }

    if (p.novo) {
      return <NewProduct {...common} />;
    }

    return <RegularProduct {...common} />;
  };

  return (
    <div className="shop-page">
      <div className="sidebar">
        <h2>Pretraga</h2>
        <input
          type="text"
          placeholder="Pretraži proizvode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h3>Brendovi</h3>
        <input
          type="text"
          placeholder="Pretraži brend..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
        />
        <div className="brand-list scrollable">
          {brands
            .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
            .map((b) => (
              <label key={b.id}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.id)}
                  onChange={() => handleBrandToggle(b.id)}
                />
                {b.name}
              </label>
            ))}
        </div>

        <h3>Kategorije</h3>
        {Object.keys(categories).map((k) => (
          <div key={k}>
            <label>
              <input
                type="checkbox"
                checked={selectedCategories.includes(k)}
                onChange={() => handleCategoryToggle(k)}
              />
              {capitalize(k)}
            </label>
            {selectedCategories.includes(k) && categories[k].length > 0 && (
              <div className="subcategories">
                {categories[k].map((s) => (
                  <label key={s}>
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(s)}
                      onChange={() => handleSubcategoryToggle(s)}
                    />
                    {capitalize(s)}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <h3>Ostalo</h3>
        <label>
          <input
            type="checkbox"
            checked={filterDiscount}
            onChange={() => setFilterDiscount((prev) => !prev)}
          />
          Na popustu
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={filterNew}
            onChange={() => setFilterNew((prev) => !prev)}
          />
          Novo
        </label>
      </div>

      <div className="products">
        {filtered.slice(0, visibleCount).map(renderProduct)}
        {visibleCount < filtered.length && (
          <button className="btn-load-more" onClick={() => setVisibleCount((prev) => prev + 10)}>
            Učitaj još
          </button>
        )}
      </div>

      <Popup isOpen={showPopup} message={popupMessage} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default ShopPage;
