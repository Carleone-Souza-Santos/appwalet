import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Transacao } from "../types/Transacao";
import { FaChartLine } from "react-icons/fa";

// ======================
// Animação de subida suave
// ======================
const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// ======================
// Container do ícone expansível
// ======================
const StatusContainer = styled.div<{ $bgColor: string }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: white;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  font-weight: bold;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 48px;
  white-space: nowrap;
  cursor: pointer;
  z-index: 999;
  animation: ${slideUp} 0.4s forwards;
  transition: width 0.3s ease, padding 0.3s ease;

  &:hover {
    width: auto;
    padding: 12px 16px;
  }

  span {
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: inline-block;
  }

  &:hover span {
    opacity: 1;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
`;

// ======================
// Tipagem das props
// ======================
interface Props {
  transacoes: Transacao[];
  mesSelecionado: number;
  anoSelecionado: number;
}

// ======================
// Componente principal
// ======================
const FinancialStatus: React.FC<Props> = ({ transacoes, mesSelecionado, anoSelecionado }) => {
  const [status, setStatus] = useState<{ color: string; message: string; down?: boolean }>({
    color: "#4caf50",
    message: "Sem transações ainda",
    down: false,
  });

  useEffect(() => {
    const transacoesDoMes = transacoes.filter(
      t => t.data.getMonth() === mesSelecionado && t.data.getFullYear() === anoSelecionado
    );

    if (transacoesDoMes.length === 0) {
      setStatus({ color: "#607D8B", message: "Sem transações ainda", down: false });
      return;
    }

    const totalGanho = transacoesDoMes
      .filter(t => t.tipo === "ganho")
      .reduce((acc, t) => acc + t.valor, 0);

    const totalGasto = transacoesDoMes
      .filter(t => t.tipo === "gasto" || t.tipo === "parcelado")
      .reduce((acc, t) => acc + t.valor, 0);

    const percentual = totalGasto / (totalGanho || 1);

    if (percentual < 0.5) {
      setStatus({ color: "#4caf50", message: "Situação Excelente", down: false });
    } else if (percentual < 0.8) {
      setStatus({ color: "#FFCE56", message: "Situação Média", down: false });
    } else {
      setStatus({ color: "#F44336", message: "Atenção! Gastos altos", down: true });
    }
  }, [transacoes, mesSelecionado, anoSelecionado]);

  return (
    <StatusContainer $bgColor={status.color}>
      <FaChartLine
        size={24}
        style={{ transform: status.down ? "rotate(180deg)" : "rotate(0deg)" }}
      />
      <span>{status.message}</span>
    </StatusContainer>
  );
};

export default FinancialStatus;
