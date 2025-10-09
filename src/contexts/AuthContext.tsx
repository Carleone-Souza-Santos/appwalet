"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { auth, db } from "@/firebase/config";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import AlertInfo from "@/components/AlertInfo";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showAlert: (message: string) => void;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  showAlert: () => { },
  isAuthorized: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const sessionTimeout = useRef<number | null>(null);

  const startSessionTimer = () => {
    if (sessionTimeout.current) clearTimeout(sessionTimeout.current);
    sessionTimeout.current = window.setTimeout(() => {
      setUser(null);
      signOut(auth).catch(err => console.error(err));
      setAlertMessage("Sua sessão expirou devido à inatividade.");
      localStorage.removeItem("userName");
      localStorage.removeItem("userPhoto");
    }, 20 * 60 * 1000);
  };

  const showAlert = (message: string) => setAlertMessage(message);

  const saveUserIfNew = async (firebaseUser: User) => {
    if (!firebaseUser) return;
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        const name = firebaseUser.displayName || "Usuário";
        const email = firebaseUser.email || "";
        const photoURL = firebaseUser.photoURL || "";

        await setDoc(userRef, {
          uid: firebaseUser.uid,
          name,
          email,
          photoURL,
          role: "bloqueado",
          day: 7,
          disabled: false,
          createdAt: serverTimestamp(),
        });

        localStorage.setItem("userName", name);
        localStorage.setItem("userPhoto", photoURL);
      } else {
        const data = snapshot.data();
        if (data.name) localStorage.setItem("userName", data.name);
        if (data.photoURL) localStorage.setItem("userPhoto", data.photoURL);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        await saveUserIfNew(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsAuthorized(
            data.role === "liberado" && !data.disabled && data.day > 0
          );
        } else setIsAuthorized(false);

        startSessionTimer();
      } else {
        setIsAuthorized(false);
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
      }
    });

    return () => unsubscribe();
  }, []);

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
    <AuthContext.Provider value={{ user, loading, showAlert, isAuthorized }}>
      {children}
      {alertMessage && <AlertInfo message={alertMessage} onClose={() => setAlertMessage(null)} />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
