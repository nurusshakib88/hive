import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHJ7geKgIlQRTSRtugehtPVJhP0FFxAYA",
  authDomain: "social-a2842.firebaseapp.com",
  projectId: "social-a2842",
  storageBucket: "social-a2842.appspot.com",
  messagingSenderId: "561265291536",
  appId: "1:561265291536:web:be6bb935d3c86038637595",
  measurementId: "G-PMQLWFQ3L4",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

export default app;
