const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// Firebase configuration for JUDN project
const firebaseConfig = {
  apiKey: "AIzaSyDFv2kJw2D1jsjat2aa-CiRodNgafgtCnU",
  authDomain: "judn-e17fa.firebaseapp.com",
  projectId: "judn-e17fa",
  storageBucket: "judn-e17fa.firebasestorage.app",
  messagingSenderId: "37377539584",
  appId: "1:37377539584:web:803d1206a53638bc7522e5",
  measurementId: "G-FVNGRF81EG",
};
