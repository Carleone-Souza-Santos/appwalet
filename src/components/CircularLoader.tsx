"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

// ====== Animação de pulso das bolinhas ======
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

// ====== Wrapper das bolinhas ======
const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100vh;
`;

// ====== Bolinha ======
const Dot = styled.div<{ delay: string }>`
  width: 15px;
  height: 15px;
  background-color: #003650;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay};
`;

// ====== Componente Loader ======
interface LoaderProps {
  isLoading: boolean;
}

const CircularLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Garante que o componente só monte no lado do cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!mounted || !show) return null;

  return (
    <LoaderWrapper>
      <Dot delay="0s" />
      <Dot delay="0.2s" />
      <Dot delay="0.4s" />
    </LoaderWrapper>
  );
};

export default CircularLoader;
