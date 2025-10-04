// firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (exposta no front-end)
const firebaseConfig = {
  apiKey: "AIzaSyDomFFQlxR4CPADvsRlLdDr3yFFLrITXP0",
  authDomain: "financas-349ed.firebaseapp.com",
  projectId: "financas-349ed",
  storageBucket: "financas-349ed.appspot.com",
  messagingSenderId: "76918486381",
  appId: "1:76918486381:web:4d11cd04510e46fb495664",
};

// Inicializa o app Firebase
export const app = initializeApp(firebaseConfig);

// Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
