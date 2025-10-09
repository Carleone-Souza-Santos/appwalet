// Importa funções essenciais do SDK do Firebase
import { initializeApp } from "firebase/app";          // Inicializa o app Firebase
import { getAuth } from "firebase/auth";               // Gerencia autenticação (login, logout, usuários)
import { getFirestore } from "firebase/firestore";     // Gerencia o banco de dados NoSQL Firestore
import { getStorage } from "firebase/storage";         // Gerencia Storage (upload/download de arquivos)

// ==============================
// 🔧 Configuração do Firebase
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyDomFFQlxR4CPADvsRlLdDr3yFFLrITXP0",
  authDomain: "financas-349ed.firebaseapp.com",
  projectId: "financas-349ed",
  storageBucket: "financas-349ed.appspot.com",
  messagingSenderId: "76918486381",
  appId: "1:76918486381:web:4d11cd04510e46fb495664",
};

// ==============================
// 🚀 Inicialização do Firebase
// ==============================
export const app = initializeApp(firebaseConfig);

// ==============================
// 🔐 Auth
// ==============================
export const auth = getAuth(app);

// ==============================
// 🗄️ Firestore
// ==============================
export const db = getFirestore(app);

// ==============================
// 📦 Storage
// ==============================
export const storage = getStorage(app);  // <- ESSENCIAL para upload de fotos
