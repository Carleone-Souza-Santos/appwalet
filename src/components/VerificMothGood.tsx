// src/components/VerificMothGood.tsx
"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Transacao } from "../types/Transacao";

// Animação de subida
const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// StatusContainer com styled-components
const StatusContainer = styled.div<{ $bgColor: string }>` // <-- note o $bgColor
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${({ $bgColor }) => $bgColor}; // <-- usa $bgColor
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 80px;
  text-align: center;
  z-index: 999;
  animation: ${slideUp} 0.4s forwards;
`;

interface Props {
  transacoes: Transacao[];
  anoSelecionado: number;
}

const BestMonthStatus: React.FC<Props> = ({ transacoes, anoSelecionado }) => {
  const [status, setStatus] = useState<{ color: string; message: string }>({ color: "#607D8B", message: "" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const meses = Array.from({ length: 12 }, (_, i) => i);
    const ganhosPorMes = meses.map(mes =>
      transacoes
        .filter(t => t.tipo === "ganho" && t.data.getMonth() === mes && t.data.getFullYear() === anoSelecionado)
        .reduce((acc, t) => acc + t.valor, 0)
    );

    const melhorValor = Math.max(...ganhosPorMes);
    const melhorMesIndex = ganhosPorMes.indexOf(melhorValor);
    const melhorMesNome = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][melhorMesIndex];

    if (melhorValor > 0) {
      setStatus({
        color: "#4CAF50",
        message: `Melhor mês: ${melhorMesNome} (${melhorValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})`
      });
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [transacoes, anoSelecionado]);

  if (!visible) return null;

  return <StatusContainer $bgColor={status.color}>{status.message}</StatusContainer>; // <-- use $bgColor
};

export default BestMonthStatus;
