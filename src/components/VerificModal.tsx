import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Transacao } from "../types/Transacao";

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const StatusContainer = styled.div<{ bgColor: string }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
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
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  transacoes: Transacao[];
  mesSelecionado: number;
  anoSelecionado: number;
}

const FinancialStatus: React.FC<Props> = ({ transacoes, mesSelecionado, anoSelecionado }) => {
  const [status, setStatus] = useState<{ color: string; message: string }>({
    color: "#4caf50",
    message: "Sem transações ainda",
  });

  useEffect(() => {
    const transacoesDoMes = transacoes.filter(
      t => t.data.getMonth() === mesSelecionado && t.data.getFullYear() === anoSelecionado
    );

    if (transacoesDoMes.length === 0) {
      setStatus({ color: "#607D8B", message: "Sem transações ainda" });
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
      setStatus({ color: "#4caf50", message: "Situação Excelente" });
    } else if (percentual < 0.8) {
      setStatus({ color: "#FFCE56", message: "Situação média" });
    } else {
      setStatus({ color: "#F44336", message: "Atenção! Gastos altos" });
    }
  }, [transacoes, mesSelecionado, anoSelecionado]);

  return <StatusContainer bgColor={status.color}>{status.message}</StatusContainer>;
};

export default FinancialStatus;
