"use client";

import React from "react";
import styled from "styled-components";
import { FaWallet, FaMoneyBillWave, FaShoppingCart, FaCreditCard } from "react-icons/fa";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
  margin: 5px 0;
`;

const Card = styled.div<{ color?: string }>`
  background: ${({ color }) => color || "#e0e0e0"};
  border-radius: 12px;
  padding: 8px 12px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  }

  /* reflexo sutil */
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
    pointer-events: none;
  }

  h3 {
    font-size: 0.8rem;
    font-weight: 500;
    margin: 0;
    opacity: 0.85;
    color: black;
  }

  p {
    color: black;
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-top: 6px;
    gap: 6px;

    svg {
      font-size: 1rem;
      opacity: 0.8;
    }
  }
`;

interface Props {
  saldo: number;
  ganhos: number;
  gastos: number;
  parcelas: number;
}

const KPICards: React.FC<Props> = ({ saldo, ganhos, gastos, parcelas }) => {
  return (
    <Container>
      <Card color="#6FA8DC">
        <h3>Saldo</h3>
        <p><FaWallet /> R$ {saldo.toFixed(2)}</p>
      </Card>
      <Card color="#81C784">
        <h3>Ganhos</h3>
        <p><FaMoneyBillWave /> R$ {ganhos.toFixed(2)}</p>
      </Card>
      <Card color="#E57373">
        <h3>Gastos</h3>
        <p><FaShoppingCart /> R$ {gastos.toFixed(2)}</p>
      </Card>
      <Card color="#FBC02D">
        <h3>Parcelados</h3>
        <p><FaCreditCard /> {parcelas} item(s)</p>
      </Card>
    </Container>
  );
};

export default KPICards;
