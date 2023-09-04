import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config({path: ".env"});

const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: "tmklb-services.firebaseapp.com",
  projectId: "tmklb-services",
  storageBucket: "tmklb-services.appspot.com",
  messagingSenderId: "954101828775",
  appId: "1:954101828775:web:bab8f6c41d5c7157391f82"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export {db};