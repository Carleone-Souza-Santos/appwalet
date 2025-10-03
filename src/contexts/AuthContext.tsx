"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/firebase/config";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import AlertInfo from "@/components/AlertInfo"; // import do modal alert

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showAlert: (message: string) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, showAlert: () => { } });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Timeout de 20 minutos (20 * 60 * 1000)
  let sessionTimeout: NodeJS.Timeout;

  const startSessionTimer = () => {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
      setUser(null);
      signOut(auth);
      // Mostra modal de logout
      setAlertMessage("Sua sessão expirou devido à inatividade.");
    }, 20 * 60 * 1000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) startSessionTimer();
    });

    return () => unsubscribe();
  }, []);

  // Reset timer quando houver interação do usuário
  useEffect(() => {
    const resetTimer = () => {
      if (user) startSessionTimer();
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [user]);

  const showAlert = (message: string) => setAlertMessage(message);

  return (
    <AuthContext.Provider value={{ user, loading, showAlert }}>
      {children}
      {alertMessage && <AlertInfo message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
