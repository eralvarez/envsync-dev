// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserSessionPersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4ie5aQt6h1xzcfay6qwpc1YrTtV741E0",
  authDomain: "envsyncdev.firebaseapp.com",
  projectId: "envsyncdev",
  storageBucket: "envsyncdev.firebasestorage.app",
  messagingSenderId: "480443630820",
  appId: "1:480443630820:web:dae06ca5effe85e66898f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: undefined,
});

export { app, auth };
