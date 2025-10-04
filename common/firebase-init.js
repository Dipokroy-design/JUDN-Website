// Firebase v10 Modular SDK Configuration
// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration for JUDN project
const firebaseConfig = {
  apiKey: "AIzaSyDFv2kJw2D1jsjat2aa-CiRodNgafgtCnU",
  authDomain: "judn-e17fa.firebaseapp.com",
  projectId: "judn-e17fa",
  storageBucket: "judn-e17fa.firebasestorage.app",
  messagingSenderId: "37377539584",
  appId: "1:37377539584:web:d7c77d0f58f0a9967522e5",
  measurementId: "G-MX2L1RXYCT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance if needed elsewhere
export { app };

console.log("Firebase initialized successfully");
