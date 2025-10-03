// src/components/BestMonthStatus.tsx
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Transacao } from "../types/Transacao";

// Animação de subida suave
const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const StatusContainer = styled.div<{ bgColor: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${({ bgColor }) => bgColor};
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  font-weight: bold;
  min-width: 220px;
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
    // Calcula o melhor mês
    const meses = Array.from({ length: 12 }, (_, i) => i);
    const ganhosPorMes = meses.map(mes => {
      return transacoes
        .filter(t => t.tipo === "ganho" && t.data.getMonth() === mes && t.data.getFullYear() === anoSelecionado)
        .reduce((acc, t) => acc + t.valor, 0);
    });
    const melhorValor = Math.max(...ganhosPorMes);
    const melhorMesIndex = ganhosPorMes.indexOf(melhorValor);
    const melhorMesNome = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][melhorMesIndex];

    if (melhorValor > 0) {
      setStatus({ color: "#4CAF50", message: `Melhor mês: ${melhorMesNome} (${melhorValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})` });
      setVisible(true);

      // Esconde depois de 3s
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [transacoes, anoSelecionado]);

  if (!visible) return null;

  return <StatusContainer bgColor={status.color}>{status.message}</StatusContainer>;
};

export default BestMonthStatus;
