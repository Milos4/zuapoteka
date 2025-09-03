import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

// mapa starih kategorija → novih kategorija
const categoryReplacements = {
  "dijetetika  i samolječenje": "Dijetetika i samoliječenje",

  
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
