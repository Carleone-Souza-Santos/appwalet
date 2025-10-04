"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardContent from "@/components/Dashboard";
import AlertInfo from "@/components/AlertInfo";
import PageOff from "@/components/PageOff";
import styled from "styled-components";
import { db } from "@/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore";

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #333;
`;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthorization = async () => {
    if (!user || !user.email) return;

    try {
      const docRef = doc(collection(db, "usuariosLiberados"), user.email);
      const docSnap = await getDoc(docRef);

      const approved = docSnap.exists();
      setIsAuthorized(approved);

      if (!approved && !alertTimeoutRef.current) {
        alertTimeoutRef.current = setTimeout(() => {
          setAlertMessage("⚠️ Atenção! Liberação sempre com o administrador.");
        }, 5000);
      }

      if (approved) {
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
          alertTimeoutRef.current = null;
        }
        setAlertMessage(null);
      }
    } catch (err) {
      console.error("Erro ao verificar autorização:", err);
      setIsAuthorized(false);
      setAlertMessage("🚫 Não foi possível verificar sua autorização.");
    }
  };

  // Detecta offline/online
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      if (user) checkAuthorization();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      checkAuthorization();

      pollingRef.current = setInterval(() => {
        checkAuthorization();
      }, 10000);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, [user, loading, router]);

  const requirePermission = (action: () => void) => {
    if (!isAuthorized) {
      setAlertMessage("🚫 Você não possui permissão para realizar esta ação.");
      return;
    }
    action();
  };

  if (loading || !user || isAuthorized === null) {
    return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;
  }

  // **Se estiver offline, mostra a página PageOff**
  if (isOffline) {
    return <PageOff />;
  }

  return (
    <>
      <DashboardContent requirePermission={requirePermission} />
      {alertMessage && (
        <AlertInfo
          key={alertMessage}
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
}
