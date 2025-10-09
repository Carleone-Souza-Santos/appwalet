"use client"; // Indica que o componente será renderizado no cliente (Next.js 13+)

import React from "react";
import styled from "styled-components";
import { FaWallet, FaMoneyBillWave, FaShoppingCart, FaCreditCard } from "react-icons/fa";
// Ícones importados da biblioteca react-icons para representar visualmente cada métrica

// ======================
// Container principal dos cards
// ======================
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); // Layout responsivo com colunas automáticas
  gap: 12px; // Espaçamento entre os cards
  margin: 5px 0; // Margem vertical
`;

// ======================
// Estilo de cada card individual
// ======================
const Card = styled.div<{ color?: string }>` // Aceita uma cor opcional como prop
  background: ${({ color }) => color || "#e0e0e0"}; // Define a cor de fundo
  border-radius: 12px; // Bordas arredondadas
  padding: 8px 12px; // Espaçamento interno
  color: #fff; // Cor do texto
  display: flex;
  flex-direction: column; // Organiza os elementos em coluna
  justify-content: center;
  align-items: flex-start; // Alinha o conteúdo à esquerda
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); // Sombra leve
  transition: all 0.25s ease-in-out; // Animações suaves
  position: relative;
  overflow: hidden; // Impede que elementos internos saiam do card

  // Efeito de elevação ao passar o mouse
  &:hover {
    transform: translateY(-3px); // Move o card levemente para cima
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12); // Aumenta a sombra
  }

  /* Reflexo sutil decorativo no fundo */
  &::before {
    content: '';
    position: absolute;
    top: -40%;
    left: -40%;
    width: 180%;
    height: 180%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: rotate(25deg);
    pointer-events: none; // Evita interferência com cliques
  }

  // Título do card
  h3 {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0;
    opacity: 0.85;
    color: black;
  }

  // Valor ou quantidade exibida no card
  p {
    color: black;
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    align-items: center; // Centraliza verticalmente o texto e o ícone
    margin-top: 6px;
    gap: 6px; // Espaço entre ícone e texto

    svg {
      font-size: 1rem;
      opacity: 0.8;
    }
  }
`;

// ======================
// Tipagem das props recebidas
// ======================
interface Props {
  saldo: number;     // Total de saldo
  ganhos: number;    // Total de ganhos
  gastos: number;    // Total de gastos
  parcelas: number;  // Quantidade de itens parcelados
}

// ======================
// Componente principal que exibe os KPIs
// ======================
const KPICards: React.FC<Props> = ({ saldo, ganhos, gastos, parcelas }) => {
  return (
    <Container>
      {/* Card de saldo */}
      <Card color="#6FA8DC">
        <h3>Saldo</h3>
        <p><FaWallet /> R$ {saldo.toFixed(2)}</p>
      </Card>

      {/* Card de ganhos */}
      <Card color="#81C784">
        <h3>Ganhos</h3>
        <p><FaMoneyBillWave /> R$ {ganhos.toFixed(2)}</p>
      </Card>

      {/* Card de gastos */}
      <Card color="#E57373">
        <h3>Gastos</h3>
        <p><FaShoppingCart /> R$ {gastos.toFixed(2)}</p>
      </Card>

      {/* Card de parcelamentos */}
      <Card color="#FBC02D">
        <h3>Parcelados</h3>
        <p><FaCreditCard /> {parcelas} item(s)</p>
      </Card>
    </Container>
  );
};

export default KPICards; // Exporta o componente para uso em outros arquivos
