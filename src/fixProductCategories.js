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

const TARGET_SUBS = ["Koža", "kosa i nokti"];
const NEW_SUB = "Koža Kosa Nokti";

export async function fixProductCategories() {
  const productsSnapshot = await getDocs(collection(db, "products"));

  for (const productDoc of productsSnapshot.docs) {
    const data = productDoc.data();
    const subs = data.subkategorije || [];

    // provjeri da li proizvod ima sve 3 podkategorije
    const hasAll = TARGET_SUBS.every((s) => subs.includes(s));
    if (!hasAll) continue;

    // ukloni Koža/Kosa/Nokti
    const cleanedSubs = subs.filter((s) => !TARGET_SUBS.includes(s));

    // dodaj novu
    cleanedSubs.push(NEW_SUB);

    await updateDoc(doc(db, "products", productDoc.id), {
      subkategorije: cleanedSubs,
    });

    console.log(
      `✔ ${productDoc.id} → podkategorije spojene u "${NEW_SUB}"`
    );
  }

  console.log("Gotovo – spojene podkategorije Koža/Kosa/Nokti ✅");
}