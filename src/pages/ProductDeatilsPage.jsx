// src/pages/ProductDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import RelatedProducts from "../components/ProductDetails/RelatedProducts";


const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Proizvod nije pronađen!");
        }
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Učitavanje...</p>;
  if (!product) return <p style={{ textAlign: "center" }}>Proizvod nije pronađen.</p>;

  return (
  <>
    <ProductDetails product={product} />
    <RelatedProducts product={product} />
  </>
);

};

export default ProductDetailsPage;
