import React from "react";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import Product from "../models/Product"; 
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const sampleProduct = new Product({
  productId: "p1",
  name: "Pametni telefon",
  brand: "Xiaomi",
  category: "Elektronika",
  subCategory: "Mobilni telefoni",
  description: "Najnoviji Xiaomi model sa odličnim kamerama.",
  discount: 10,
  price: 999.99,
  stockQuantity: true,
  imageUrl: "https://images.pexels.com/photos/66869/green-leaf-natural-wallpaper-royalty-free-66869.jpeg",
  brandImageUrl:"https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png"
});

const ProductPage = () => {


  return (
    <div style={{ backgroundColor: '#FAF1E6' }}>
              <Navbar />


  <ProductDetails product={sampleProduct} />;
  <Footer/>
  </div>
  )
};

export default ProductPage;