// Handling Firestore operations on the frontend.
// for newbies : this connection connects us to the firestore normal database


// Example Use Case:

// Storing user profiles where each user has documents like {name, age, email}.
// Keeping blog posts or other structured data.
import dotenv from "dotenv";
dotenv.config();
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (should match the one in Firebase Console)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore_db = getFirestore(app);



