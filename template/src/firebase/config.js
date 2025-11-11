// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXIVsGHYNakw0upmERYG3c35Tngod-8uk",
  authDomain: "authentication-finder.firebaseapp.com",
  projectId: "authentication-finder",
  storageBucket: "authentication-finder.firebasestorage.app",
  messagingSenderId: "484174390315",
  appId: "1:484174390315:web:259943de4b22837315766e",
  measurementId: "G-B1G1Q76YR7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set language code for phone auth
auth.languageCode = "en";

// Log configuration for debugging
console.log("Firebase initialized with project:", firebaseConfig.projectId);
console.log("Auth domain:", firebaseConfig.authDomain);

// Important: Ensure these are enabled in Google Cloud Console:
// 1. Identity Toolkit API
// 2. Cloud Identity Platform
// 3. Phone Authentication provider in Firebase Console
// 4. API Key restrictions are properly configured

export { auth, app };
