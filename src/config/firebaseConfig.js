// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Auth service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfHTEot6aznoDu_aNF6xElHM-6hetNsJs",
  authDomain: "userappquest.firebaseapp.com",
  databaseURL: "https://userappquest.firebaseio.com",
  projectId: "userappquest",
  storageBucket: "userappquest.firebasestorage.app",
  wmessagingSenderId: "702984912073",
  appId: "1:702984912073:web:2580d48a25d82d63",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth }; // Export auth as well
