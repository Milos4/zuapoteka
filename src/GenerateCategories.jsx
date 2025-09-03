import React, { useEffect } from "react";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // putanja do tvog firebase configa

const GenerateCategories = () => {
  useEffect(() => {
    async function generate() {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const categoryMap = {};


      // napravi mapu kategorija → subkategorije
      productsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let kat = data.kategorija || "Ostalo";

        const subs = data.subkategorije || [];
        if (!categoryMap[kat]) categoryMap[kat] = new Set();
        subs.forEach((sub) => categoryMap[kat].add(sub));
      });

      // snimanje kategorija
      for (const kat in categoryMap) {
        const docRef = doc(db, "kategorije", kat);
        const existingDoc = await getDoc(docRef);

        if (!existingDoc.exists()) {
          // ako kategorija ne postoji → napravi novu
          await setDoc(docRef, {
            naziv: kat,
            subkategorije: Array.from(categoryMap[kat]),
          });
          console.log(`Dodana nova kategorija: ${kat}`);
        } else {
          // ako postoji → spoji nove subkategorije sa starima
          const existingData = existingDoc.data();
          const existingSubs = new Set(existingData.subkategorije || []);

          // spoji stare i nove subkategorije
          categoryMap[kat].forEach((sub) => existingSubs.add(sub));

          await setDoc(docRef, {
            naziv: kat,
            subkategorije: Array.from(existingSubs),
          });

          console.log(`Ažurirana kategorija: ${kat}`);
        }
      }

      console.log("Generisanje završeno ✅");
    }
    generate();
  }, []);

  return <div>Generišem kategorije...</div>;
};

export default GenerateCategories;
