"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardContent from "@/components/Dashboard"; // Dashboard original
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #333;
`;

const BlockedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  color: #a00;
  font-size: 1.2rem;
`;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // 🔥 Aqui simulamos uma checagem no Firebase
    // No seu backend ou Firestore, você deve ter um campo "approved" ou "liberado"
    const checkAdminApproval = async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        const isApproved = token.claims?.approved || false; // ou pegar do Firestore se preferir

        setIsAuthorized(isApproved);
      }
    };

    if (user) checkAdminApproval();
  }, [user, loading, router]);

  if (loading || !user) {
    return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;
  }

  if (isAuthorized === false) {
    return (
      <BlockedContainer>
        🚫 Seu acesso ainda não foi liberado pelo administrador.
        <br />
        Entre em contato com o suporte ou aguarde ...
      </BlockedContainer>
    );
  }

  if (isAuthorized === null) {
    return <LoadingContainer>Verificando liberação com o ADM...</LoadingContainer>;
  }

  return <DashboardContent />;
}
