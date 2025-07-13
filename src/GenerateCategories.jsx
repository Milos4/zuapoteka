import React, { useEffect } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase"; // putanja do tvog firebase configa

const GenerateCategories = () => {
  useEffect(() => {
    async function generate() {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const categoryMap = {};

      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        const kat = data.kategorija || "Ostalo";
        const subs = data.subkategorije || [];
        if (!categoryMap[kat]) categoryMap[kat] = new Set();
        subs.forEach((sub) => categoryMap[kat].add(sub));
      });

      for (const kat in categoryMap) {
        const subArray = Array.from(categoryMap[kat]);
        await setDoc(doc(db, "kategorije", kat), {
          naziv: kat,
          subkategorije: subArray,
        });
      }
      console.log("Kategorije generisane.");
    }
    generate();
  }, []);

  return <div>Generišem kategorije...</div>;
};

export default GenerateCategories;
