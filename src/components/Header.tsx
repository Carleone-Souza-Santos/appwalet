"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { FiLogOut } from "react-icons/fi";
import { FaWpforms } from "react-icons/fa";
import ComparisonModal from "./ComparisonModal";

const Container = styled.header<{ fixed?: boolean }>`
  position: ${({ fixed }) => (fixed ? "fixed" : "relative")};
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  background: linear-gradient(
    to right,
    rgba(0, 54, 80, 0.1) 0%,
    rgba(0, 54, 80, 0.4) 40%,
    rgba(0, 54, 80, 0.8) 100%
  );
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: space-between;
  align-items: center; /* <-- centraliza verticalmente */
  color: #fff;
  z-index: 999;
  transition: background 0.4s ease;
`;

const Logo = styled.h1`
  color:#3c6579;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
`;

/* Wrapper pros botões ficarem juntos */
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px; /* espaçamento entre os botões */
`;

const IconButton = styled.button`
  background: #fff;
  color: #003650;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
`;

export default function Header() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!mounted) return null;

  return (
    <Container>
      <Logo>Wall</Logo>

      {user && (
        <>
          <ButtonGroup>
            <IconButton onClick={() => setModalOpen(true)}>
              <FaWpforms size={12} />
            </IconButton>

            <IconButton onClick={handleLogout}>
              <FiLogOut size={12} />
            </IconButton>
          </ButtonGroup>

          {modalOpen && (
            <ComparisonModal onClose={() => setModalOpen(false)} />
          )}
        </>
      )}
    </Container>
  );
}
