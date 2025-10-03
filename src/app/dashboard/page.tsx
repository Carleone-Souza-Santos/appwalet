"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardContent from "@/components/Dashboard"; // seu Dashboard original com gráficos, cards, etc.
import styled from "styled-components";

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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // não logado -> vai pro login
    }
  }, [user, loading, router]);

  if (loading || !user) return <LoadingContainer>Carregando Dashboard...</LoadingContainer>;

  return <DashboardContent />;
}
