
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw5QHUZ4bPmzg4UbvjOzhyEqTrmU-IT4Y",
  authDomain: "saligao-ancestors.firebaseapp.com",
  projectId: "saligao-ancestors",
  storageBucket: "saligao-ancestors.firebasestorage.app",
  messagingSenderId: "1081679729656",
  appId: "1:1081679729656:web:2c349f4d703d7aecb67c0d",
  measurementId: "G-VCCKV97XJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);