import React from "react";
import "./Wishlist.css";
import { SlBasket, SlTrash, SlEye } from "react-icons/sl";

const dummyWishlist = [
  {
    id: "1",
    naziv: "Vitamin C 1000mg",
    brandImageUrl: "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
    kategorija: "Dodaci ishrani",
    cijena: 12.99,
    naPopustu: true,
    popustProcenat: 20,
    slikaURL: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg",
  },
  {
    id: "2",
    naziv: "Magnesium Forte",
    brandImageUrl: "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
    kategorija: "Minerali",
    cijena: 9.5,
    naPopustu: false,
    popustProcenat: 0,
    slikaURL: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg",
  },
  {
    id: "2",
    naziv: "Magnesium Forte",
    brandImageUrl: "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
    kategorija: "Minerali",
    cijena: 9.5,
    naPopustu: false,
    popustProcenat: 0,
    slikaURL: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg",
  },
  {
    id: "2",
    naziv: "Magnesium Forte",
    brandImageUrl: "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
    kategorija: "Minerali",
    cijena: 9.5,
    naPopustu: false,
    popustProcenat: 0,
    slikaURL: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg",
  },
  {
    id: "2",
    naziv: "Magnesium Forte",
    brandImageUrl: "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
    kategorija: "Minerali",
    cijena: 9.5,
    naPopustu: false,
    popustProcenat: 0,
    slikaURL: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg",
  },
  {
    id: "2",
    naziv: "Magnesium Forte",
    brandImageUrl: "https://logos-world.net/wp-content/uploads/2020/04/LOreal-Logo.png",
    kategorija: "Minerali",
    cijena: 9.5,
    naPopustu: false,
    popustProcenat: 0,
    slikaURL: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2023-02/lipton-green-tea-ls-230221-4cae2a.jpg",
  },
];
const Wishlist = () => {
  return (
    <div className="wishlist-container">
      {dummyWishlist.length === 0 ? (
        <p className="wishlist-empty">Vaša lista želja je prazna.</p>
      ) : (
        dummyWishlist.map((item) => {
          const novaCijena = item.naPopustu
            ? (item.cijena * (1 - item.popustProcenat / 100)).toFixed(2)
            : null;

          return (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-left">
                <img
                  src={item.slikaURL}
                  alt="Proizvod"
                  className="wishlist-product-img"
                />
              </div>

              <div className="wishlist-middle">
                <h3 className="wishlist-naziv">{item.naziv}</h3>
                <p className="wishlist-kategorija">{item.kategorija}</p>
                <img
                  src={item.brandImageUrl}
                  alt="Brend"
                  className="wishlist-brand-logo"
                />
              </div>

              <div className="wishlist-right">
                <div className="wishlist-cijena">
                  {item.naPopustu ? (
                    <>
                      <span className="old-price">{item.cijena} KM</span>
                      <span className="new-price">{novaCijena} KM</span>
                    </>
                  ) : (
                    <span>{item.cijena} KM</span>
                  )}
                </div>
                <div className="wishlist-actions">
                  <button title="Dodaj u korpu">
                    <SlBasket />
                  </button>
                  <button title="Vidi proizvod">
                    <SlEye />
                  </button>
                  <button title="Ukloni iz liste">
                    <SlTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Wishlist;
