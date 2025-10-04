"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardContent from "@/components/Dashboard";
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

  /* pequeno botão neutro para recarregar status */
  button {
    margin-top: 16px;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    background: #003650;
    color: white;
    cursor: pointer;
  }
`;

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // null = ainda verificando, true = autorizado, false = bloqueado
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // polling control
  const pollingRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 6; // tentar por 6 vezes
  const INTERVAL_MS = 10000; // a cada 10s

  // Função que checa as claims (forçando refresh do token)
  const checkAdminApproval = async (forceRefresh = true) => {
    if (!user) return;
    try {
      // força refresh do token para obter claims atualizadas
      const tokenResult = await user.getIdTokenResult(forceRefresh);
      const isApproved = !!tokenResult.claims?.approved;
      setIsAuthorized(isApproved);
      return isApproved;
    } catch (err) {
      console.error("Erro ao obter token/result:", err);
      setIsAuthorized(false);
      return false;
    }
  };

  useEffect(() => {
    // se não logado, manda pro login
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    let mounted = true;

    const startCheck = async () => {
      if (!user) return;

      // primeira checagem - força refresh
      const approved = await checkAdminApproval(true);
      if (!mounted) return;

      // se não aprovado, inicia polling para tentar novamente por alguns instantes
      if (!approved && pollingRef.current === null) {
        attemptsRef.current = 0;
        pollingRef.current = window.setInterval(async () => {
          attemptsRef.current += 1;
          try {
            const ok = await checkAdminApproval(true);
            if (ok) {
              // liberado — parar polling
              if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
            } else if (attemptsRef.current >= MAX_ATTEMPTS) {
              // alcançou número máximo de tentativas — parar polling
              if (pollingRef.current) {
                window.clearInterval(pollingRef.current);
                pollingRef.current = null;
              }
            }
          } catch (e) {
            console.error("Polling error:", e);
          }
        }, INTERVAL_MS);
      }
    };

    if (user) startCheck();

    return () => {
      mounted = false;
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user, loading, router]);

  // botão de recarregar manual
  const handleManualRefresh = async () => {
    if (!user) return;
    // limpa polling atual
    if (pollingRef.current) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    attemptsRef.current = 0;
    setIsAuthorized(null); // volta pro estado verificando
    await checkAdminApproval(true);
  };

  // renderizações
  if (loading || !user) {
    return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;
  }

  if (isAuthorized === null) {
    return <LoadingContainer>Verificando liberação com o ADM...</LoadingContainer>;
  }

  if (isAuthorized === false) {
    return (
      <BlockedContainer>
        🚫 Seu acesso ainda não foi liberado pelo administrador.
        <br />
        Aguarde a liberação ou entre em contato com o suporte.
        <button onClick={handleManualRefresh}>Recarregar status</button>
      </BlockedContainer>
    );
  }

  // isAuthorized === true
  return <DashboardContent />;
}
