"use client";

import React from "react";
import styled from "styled-components";
import {
  FaCreditCard,
  FaUniversity,
  FaChartLine,
  FaWallet,
  FaShoppingCart,
} from "react-icons/fa";

// Container fixo da sidebar
const SidebarContainer = styled.div`
  position: fixed;
  top: 80px;
  left: 20px;
  width: 60px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
  align-items: center;
  z-index: 1000;
`;

// Label do ano exibido no topo
const AnoLabel = styled.h6`
  color: rgb(18, 18, 19);
  font-size: 0.8rem;
  font-weight: 800;
  margin: 0;
  
`;

// Tooltip exibido ao passar o mouse sobre o ícone
const Tooltip = styled.div`
  position: absolute;
  left: 70px;
  background: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

// Wrapper de cada ícone e seu tooltip
const IconWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  // Exibe o tooltip ao passar o mouse
  &:hover ${Tooltip} {
    opacity: 1;
  }
`;

// Botão clicável do ícone
const IconButton = styled.button<{ color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ color }) => color || "#628292"};
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

// Label abaixo do ícone mostrando valores ou percentual
const ValueLabel = styled.span<{ negative?: boolean }>`
  margin-top: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${({ negative }) => (negative ? "#F44336" : "#628292")};
  text-align: center;
  white-space: nowrap;
  transition: color 0.3s ease;
`;

// ==========================
// Tipos para as propriedades
// ==========================
interface SidebarIconsProps {
  totalGanhoAno?: number;
  totalGastoAno?: number;
  totalDepositoAno?: number;
  totalParcelamentoAno?: number;
  onClick?: (index: number) => void;
}

// ==========================
// Dados dos ícones e labels
// ==========================
const icons = [
  { component: <FaWallet />, label: "Ganho" },
  { component: <FaShoppingCart />, label: "Gasto" },
  { component: <FaCreditCard />, label: "Parcelamento" },
  { component: <FaChartLine />, label: "Análise" },
  { component: <FaUniversity />, label: "Depósitos" },
];

// ==========================
// Componente principal
// ==========================
const SidebarIcons: React.FC<SidebarIconsProps> = ({
  totalGanhoAno = 0,
  totalGastoAno = 0,
  totalDepositoAno = 0,
  totalParcelamentoAno = 0,
  onClick,
}) => {
  const anoAtual = new Date().getFullYear();

  // Calcula percentual de gasto em relação ao ganho total
  const percentualGasto =
    totalGanhoAno > 0
      ? ((totalGastoAno + totalDepositoAno) / totalGanhoAno) * 100
      : 0;

  // Define cores condicionais
  const corCarteira = percentualGasto > 55 ? "#F44336" : "#628292";
  const corGrafico = percentualGasto > 55 ? "#F44336" : "#628292";

  const isNegative = (value: boolean) => (value ? true : undefined);

  return (
    <SidebarContainer>
      <AnoLabel>{anoAtual}</AnoLabel>

      {icons.map((iconObj, i) => (
        <IconWrapper key={i}>
          <IconButton
            onClick={() => onClick && onClick(i)}
            color={i === 0 ? corCarteira : i === 3 ? corGrafico : "#628292"}
          >
            {iconObj.component}
          </IconButton>

          <Tooltip>{iconObj.label}</Tooltip>

          {i === 0 && (
            <ValueLabel negative={isNegative(corCarteira === "#F44336")}>
              R$ {totalGanhoAno.toFixed(2)}
            </ValueLabel>
          )}
          {i === 1 && (
            <ValueLabel negative={isNegative(percentualGasto > 55)}>
              R$ {totalGastoAno.toFixed(2)}
            </ValueLabel>
          )}
          {i === 2 && (
            <ValueLabel>R$ {totalParcelamentoAno.toFixed(2)}</ValueLabel>
          )}
          {i === 3 && (
            <ValueLabel negative={isNegative(percentualGasto > 55)}>
              {percentualGasto.toFixed(0)}% gasto
            </ValueLabel>
          )}
          {i === 4 && (
            <ValueLabel>R$ {totalDepositoAno.toFixed(2)}</ValueLabel>
          )}
        </IconWrapper>
      ))}
    </SidebarContainer>
  );
};

export default SidebarIcons;