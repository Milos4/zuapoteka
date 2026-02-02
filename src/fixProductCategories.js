// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase";

// // kategorija → podkategorija (specijalni slučaj)
// const categoryToSubcategory = {
//   "Lice čišćenje": {
//     newCategory: "Dermokozmetika",
//     subcategory: "Lice čišćenje",
//   },
// };

// export async function fixProductCategories() {
//   const productsSnapshot = await getDocs(collection(db, "products"));

//   for (const productDoc of productsSnapshot.docs) {
//     const data = productDoc.data();
//     const currentCategory = data.kategorija || "";
//     const currentSubcategories = Array.isArray(data.subkategorije)
//       ? data.subkategorije
//       : [];

//     // SAMO ovaj slučaj
//     if (categoryToSubcategory[currentCategory]) {
//       const { newCategory, subcategory } =
//         categoryToSubcategory[currentCategory];

//       const newSubcategories = new Set(currentSubcategories);
//       newSubcategories.add(subcategory);

//       await updateDoc(doc(db, "products", productDoc.id), {
//         kategorija: newCategory,
//         subkategorije: Array.from(newSubcategories),
//       });

//       console.log(
//         `✔ ${productDoc.id}: "${currentCategory}" → kategorija "${newCategory}", podkategorija "${subcategory}"`
//       );
//     }
//   }

//   console.log("Gotovo ✅");
// }


// import {
//   collection,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "./firebase";

// // kategorija → podkategorija (specijalni slučaj)
// const categoryToSubcategory = {
//   "Lice čišćenje": {
//     newCategory: "Dermokozmetika",
//     subcategory: "Lice čišćenje",
//   },
// };

// export async function fixProductCategories() {
//   const productsSnapshot = await getDocs(collection(db, "products"));

//   for (const productDoc of productsSnapshot.docs) {
//     const data = productDoc.data();
//     const currentCategory = data.kategorija || "";
//     const currentSubcategories = Array.isArray(data.subkategorije)
//       ? data.subkategorije
//       : [];

//     // SAMO ovaj slučaj
//     if (categoryToSubcategory[currentCategory]) {
//       const { newCategory, subcategory } =
//         categoryToSubcategory[currentCategory];

//       const newSubcategories = new Set(currentSubcategories);
//       newSubcategories.add(subcategory);

//       await updateDoc(doc(db, "products", productDoc.id), {
//         kategorija: newCategory,
//         subkategorije: Array.from(newSubcategories),
//       });

//       console.log(
//         `✔ ${productDoc.id}: "${currentCategory}" → kategorija "${newCategory}", podkategorija "${subcategory}"`
//       );
//     }
//   }

//   console.log("Gotovo ✅");
// }

import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

// podkategorije koje tražimo
const TARGET_SUBS = ["preparati za san", "umirenje i relaksaciju"];
const NEW_SUB = "Preparati za umirenje san i relaksaciju";

export async function fixProductCategories() {
  const productsSnapshot = await getDocs(collection(db, "products"));

  for (const productDoc of productsSnapshot.docs) {
    const data = productDoc.data();
    const subs = data.subkategorije || [];

    // provjeri da li proizvod ima obje podkategorije
    const hasAll = TARGET_SUBS.every((s) => subs.includes(s));
    if (!hasAll) continue;

    // zamijeni sve podkategorije samo sa novom
    await updateDoc(doc(db, "products", productDoc.id), {
      subkategorije: [NEW_SUB],
    });

    console.log(
      `✔ ${productDoc.id} → sve podkategorije zamijenjene sa "${NEW_SUB}"`
    );
  }

  console.log(`Gotovo – podkategorije zamijenjene ✅`);
}