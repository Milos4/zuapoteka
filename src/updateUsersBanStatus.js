import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

// Tvoja Firebase konfiguracija
const firebaseConfig = {
  apiKey: "AIzaSyAmhsrakdQc216R1bBRmwzUGhr9FujLDHA",
  authDomain: "apotekahigra-42d45.firebaseapp.com",
  projectId: "apotekahigra-42d45",
  storageBucket: "apotekahigra-42d45.firebasestorage.app",
  messagingSenderId: "340471167604",
  appId: "1:340471167604:web:a5a6f485b53e56e85baf21",
  measurementId: "G-HN24D2NWXQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateBanStatus() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  for (const userDoc of snapshot.docs) {
    const data = userDoc.data();
    if (data.banovan === undefined) {
      await updateDoc(doc(db, "users", userDoc.id), { banovan: false });
      console.log(`Dodato banovan polje korisniku: ${userDoc.id}`);
    }
  }
  console.log("Svi korisnici su ažurirani.");
}

updateBanStatus().catch(console.error);
