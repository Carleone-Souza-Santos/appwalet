// src/components/SidebarIcons.tsx
import React from "react";
import styled from "styled-components";
import { FaCreditCard, FaUniversity, FaChartLine, FaWallet, FaShoppingCart } from "react-icons/fa";

const SidebarContainer = styled.div`
  position: fixed;
  top: 80px;
  left: 20px;
  width: 60px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
  align-items: center;
  z-index: 1000;
`;

const IconButton = styled.button<{ color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ color }) => color || "#628292"};
  font-size: 1.5rem;
  transition: all 0.3s ease; /* transição suave de cor e transformação */

  &:hover {
    transform: scale(1.2);
  }
`;

const ValueLabel = styled.span<{ negative?: boolean }>`
  margin-top: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${({ negative }) => (negative ? "#F44336" : "#628292")};
  text-align: center;
  white-space: nowrap;
  transition: color 0.3s ease; /* transição suave da cor do texto */
`;

interface SidebarIconsProps {
  totalGanhoAno: number;
  totalGastoAno: number;
  totalDepositoAno?: number;
  totalParcelamentoAno?: number;
  onClick?: (index: number) => void;
}

const icons = [
  { component: <FaWallet />, label: "Ganho" },
  { component: <FaShoppingCart />, label: "Gasto" },
  { component: <FaCreditCard />, label: "Parcelamento" },
  { component: <FaChartLine />, label: "Gráfico" },
  { component: <FaUniversity />, label: "Depósitos" },
];

const SidebarIcons: React.FC<SidebarIconsProps> = ({
  totalGanhoAno,
  totalGastoAno,
  totalDepositoAno = 0,
  totalParcelamentoAno = 0,
  onClick,
}) => {
  const percentualGasto = totalGanhoAno > 0
    ? ((totalGastoAno + totalDepositoAno) / totalGanhoAno) * 100
    : 0;

  const corCarteira = percentualGasto > 55 ? "#F44336" : "#628292";
  const corGrafico = percentualGasto > 55 ? "#F44336" : "#628292";

  return (
    <SidebarContainer>
      {icons.map((iconObj, i) => (
        <IconButton
          key={i}
          onClick={() => onClick && onClick(i)}
          color={i === 0 ? corCarteira : i === 3 ? corGrafico : "#628292"}
        >
          {iconObj.component}

          {i === 0 && (
            <ValueLabel negative={corCarteira === "#F44336"}>
              R$ {totalGanhoAno.toFixed(2)}
            </ValueLabel>
          )}
          {i === 1 && (
            <ValueLabel negative={percentualGasto > 55}>
              R$ {totalGastoAno.toFixed(2)}
            </ValueLabel>
          )}
          {i === 2 && (
            <ValueLabel>
              R$ {totalParcelamentoAno.toFixed(2)}
            </ValueLabel>
          )}
          {i === 3 && (
            <ValueLabel negative={percentualGasto > 55}>
              {percentualGasto.toFixed(0)}% gasto
            </ValueLabel>
          )}
          {i === 4 && (
            <ValueLabel>
              R$ {totalDepositoAno.toFixed(2)}
            </ValueLabel>
          )}
        </IconButton>
      ))}
    </SidebarContainer>
  );
};

export default SidebarIcons;
