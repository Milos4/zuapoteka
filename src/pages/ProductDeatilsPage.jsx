import React from "react";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import Product from "../models/Product";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const sampleProduct = new Product({
  productId: "p1",
  name: "Krema za tijelo",
  brand: "Loreal",
  category: "Njega tijela",
  subCategory: "Kreme",
  description: "Najnovija Loreal krema sa mirisom lavande.",
  discount: 10,
  price: 44.55,
  stockQuantity: true,
  imageUrl:
    "https://images.pexels.com/photos/66869/green-leaf-natural-wallpaper-royalty-free-66869.jpeg",
  brandImageUrl:
    "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
});

const ProductPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        color: "#333",
        lineHeight: 1.6,
        backgroundColor: "#FAF1E6",
      }}
    >
      <ProductDetails product={sampleProduct} />;
      <Footer />
    </div>
  );
};

export default ProductPage;
