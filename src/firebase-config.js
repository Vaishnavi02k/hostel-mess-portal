import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN ,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: "1088097622877",
  appId: "1:1088097622877:web:7c10afbe3248d7118fe6b4",
  measurementId: "G-0P9M8T426Z"
};

const app = initializeApp(firebaseConfig);

export const db=getFirestore(app);