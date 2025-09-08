import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

// mapa starih kategorija → novih kategorija
const categoryReplacements = {
  "Higijena,njega i ostalo": "Higijena, njega i ostalo",
  "Preparati za masažu i regeneraciju9.70":"Preparati za masažu i regeneraciju",
    "mama i bebe":"Mama i bebe",
        "higijena,njega i ostalo":"Higijena, njega i ostalo",
        "dijetetika i samoliječenje":"Dijetetika i samoliječenje",
"zdrava hrana i čajevi":"Zdrava hrana i čajevi",
"medicinska pomagala":"Medicinska pomagala"



  
  // dodaj koliko god treba
};

export async function fixProductCategories() {
  const productsSnapshot = await getDocs(collection(db, "products"));

  for (const productDoc of productsSnapshot.docs) {
    const data = productDoc.data();
    const currentCategory = data.kategorija;

    if (categoryReplacements[currentCategory]) {
      const newCategory = categoryReplacements[currentCategory];

      await updateDoc(doc(db, "products", productDoc.id), {
        kategorija: newCategory,
      });

      console.log(
        `Proizvod ${productDoc.id} kategorija promijenjena iz "${currentCategory}" u "${newCategory}"`
      );
    }
  }

  console.log("Gotovo ✅");
}
