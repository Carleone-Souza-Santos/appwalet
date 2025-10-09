"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

// ===== Animação de fadeIn suave =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ===== Container principal =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #212121, #424242);
  color: #fff;
  padding: 20px;
  animation: ${fadeIn} 0.6s ease forwards;
  font-family: 'Inter', sans-serif;
`;

// ===== Título =====
const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
`;

// ===== Mensagem =====
const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 25px;
  max-width: 400px;
  line-height: 1.5;
  color: #e0e0e0;
`;

// ===== Badge dias restantes =====
const DaysBadge = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #ff8a65, #ff7043);
  color: #fff;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 50px;
  font-size: 1rem;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

// ===== Botão de logout =====
const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #333;
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  &:hover {
    background: #ff7043;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.4);
  }
`;

interface PageNotUserProps {
  remainingDays: number | null;
}

export default function PageOneContact({ remainingDays }: PageNotUserProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <Container>
      <Title>🚫 Acesso Bloqueado</Title>
      <Message>
        {user
          ? `Olá ${user.displayName || "Usuário"}, sua conta ainda não foi liberada pelo administrador.`
          : "Você não está autorizado a acessar esta página."}
      </Message>
      {remainingDays !== null && remainingDays > 0 && (
        <DaysBadge>{remainingDays} dias restantes de teste</DaysBadge>
      )}
      <LogoutButton onClick={handleLogout}>
        <FiLogOut size={20} /> Sair
      </LogoutButton>
    </Container>
  );
}
