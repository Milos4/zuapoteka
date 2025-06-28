// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmhsrakdQc216R1bBRmwzUGhr9FujLDHA",
  authDomain: "apotekahigra-42d45.firebaseapp.com",
  projectId: "apotekahigra-42d45",
  storageBucket: "apotekahigra-42d45.firebasestorage.app",
  messagingSenderId: "340471167604",
  appId: "1:340471167604:web:a5a6f485b53e56e85baf21",
  measurementId: "G-HN24D2NWXQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

// 📦 Povezivanje sa Storage
const storage = getStorage(app);

const auth = getAuth(app);

export { db, storage, auth };
