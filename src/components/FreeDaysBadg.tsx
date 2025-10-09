"use client";

import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/AuthContext";

// ======= Animação de fade =======
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ======= Estilos =======
const Badge = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "visible",
}) <{ visible: boolean }>`
  position: fixed;
  top: 10px;
  right: 230px;
  background-color: #40677b;
  color: #fff;
  padding: 8px 14px;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 0 0 10px #2563eb80;
  animation: ${fadeIn} 0.5s ease-in-out;
  z-index: 99999;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

export default function FreeDaysBadge() {
  const { user } = useAuth();
  const [days, setDays] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Atualiza em tempo real o número de dias
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const data = snap.data() || {};
      setDays(data.day ?? null);
    });

    return () => unsubscribe();
  }, [user]);

  // Controla a exibição a cada 2 minutos com som
  useEffect(() => {
    if (days === null || days <= 0) return;

    const interval = setInterval(() => {
      setVisible(true);

      // Toca som se houver audio
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }

      // Oculta após 5 segundos
      setTimeout(() => setVisible(false), 100000);
    }, 10 * 60 * 5000); // 5 minutos

    return () => clearInterval(interval);
  }, [days]);

  if (days === null || days <= 0) return null;

  return (
    <>
      <Badge visible={visible}>{days} dias grátis restantes</Badge>
      {/* Substitua src pelo caminho do seu som */}
      <audio ref={audioRef} src="/sound/quick-ting.mp3" />
    </>
  );
}
