// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA8S-tTqMTtpRIJfeb1UCQdVum9Aigp-zY",
  authDomain: "case-dev-35d21.firebaseapp.com",
  projectId: "case-dev-35d21",
  storageBucket: "case-dev-35d21.appspot.com",
  messagingSenderId: "450822620687",
  appId: "1:450822620687:web:de2bbd1455f2e1f407857a",
  measurementId: "G-81RMC45TPD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
