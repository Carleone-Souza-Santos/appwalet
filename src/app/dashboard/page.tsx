"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardContent from "@/components/Dashboard";
import PageOff from "@/components/PageOff";
import styled from "styled-components";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import FreeDaysBadge from "@/components/FreeDaysBadg";
import CircularLoader from "@/components/CircularLoader";
import PageOneContact from "@/components/PageOneContact";

// ===== Loading Container =====
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
`;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [remainingDays, setRemainingDays] = useState<number | null>(null); // dias restantes

  // ===== Detecta status online/offline =====
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // ===== Verifica usuário e permissões =====
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const setupUser = async () => {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Cria usuário bloqueado com 14 dias
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Usuário",
          photoURL: user.photoURL || "🚫",
          role: "bloqueado",
          day: 14,
          disabled: false,
          createdAt: serverTimestamp(),
        });
        setIsAuthorized(false);
        setRemainingDays(14);
        return;
      }

      const data = userSnap.data();

      setIsAuthorized(
        data.role === "liberado" && data.disabled === false && (data.day ?? 0) > 0
      );
      setRemainingDays(data.day ?? 0);

      // Atualização em tempo real
      const unsubscribe = onSnapshot(userRef, (snap) => {
        const updated = snap.data();
        if (updated) {
          setIsAuthorized(
            updated.role === "liberado" &&
            updated.disabled === false &&
            (updated.day ?? 0) > 0
          );
          setRemainingDays(updated.day ?? 0);
        }
      });

      return () => unsubscribe();
    };

    setupUser();
  }, [user, loading, router]);

  // ===== Loading =====
  if (loading || isAuthorized === null) {
    return (
      <LoadingContainer>
        Carregando Dashboard...
        <CircularLoader isLoading={loading} />
      </LoadingContainer>
    );
  }

  if (isOffline) return <PageOff />;
  if (!isAuthorized) return <PageOneContact remainingDays={remainingDays} />;

  return (
    <>
      <DashboardContent />
      <FreeDaysBadge />
    </>
  );
}
