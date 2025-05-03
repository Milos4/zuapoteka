// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzoEtwSoeWH4VTupxxyeToueNHqgRS44M",
  authDomain: "zuapoteka.firebaseapp.com",
  projectId: "zuapoteka",
  storageBucket: "zuapoteka.firebasestorage.app",
  messagingSenderId: "872094696441",
  appId: "1:872094696441:web:e76746a78aa075685e3328",
  measurementId: "G-WLRE22Z6EV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export { db };
