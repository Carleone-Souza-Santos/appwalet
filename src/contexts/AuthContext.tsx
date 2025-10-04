"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { auth } from "@/firebase/config";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import AlertInfo from "@/components/AlertInfo";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showAlert: (message: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  showAlert: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const sessionTimeout = useRef<NodeJS.Timeout | null>(null);

  const startSessionTimer = () => {
    if (sessionTimeout.current) clearTimeout(sessionTimeout.current);
    sessionTimeout.current = setTimeout(() => {
      setUser(null);
      signOut(auth);
      setAlertMessage("Sua sessão expirou devido à inatividade.");
    }, 20 * 60 * 1000); // 20 minutos
  };

  const showAlert = (message: string) => setAlertMessage(message);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        startSessionTimer();
      }
    });

    return () => unsubscribe();
  }, []);

  // Reinicia o timer ao detectar atividade
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

  return (
    <AuthContext.Provider value={{ user, loading, showAlert }}>
      {children}
      {alertMessage && (
        <AlertInfo message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
