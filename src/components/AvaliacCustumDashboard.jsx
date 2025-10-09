"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaBolt, FaWater, FaFire, FaWifi, FaHome, FaBuilding, FaCar, FaMotorcycle,
  FaFilm, FaShoppingCart, FaHospital, FaTools, FaDog, FaWrench, FaCreditCard,
  FaGasPump, FaBus, FaBook, FaLaptopCode, FaUtensils, FaCoffee, FaPrescriptionBottle,
  FaFileInvoiceDollar, FaFileInvoice, 
  FaHamburger,
  FaUser,
  FaExclamationTriangle,
  FaPlayCircle,
  FaShoppingBasket,
  FaStore,
  FaUber,
  FaTshirt,
  FaGem,
  FaShoePrints,
  FaSpa,
  FaUmbrellaBeach,
  FaPlane,
  FaGift,
  FaDumbbell,
  FaTrash} from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";


// Gastos
export const gastos = [
  { value: "Academia" , label: "Academia" , icon :<FaDumbbell /> },
  { value: "Agua", label: "Água", icon: <FaWater /> },
  { value: "Aluguel", label: "Aluguel", icon: <FaHome /> },
  { value: "Cafe", label: "Café", icon: <FaCoffee /> },
  { value: "Calcados", label: "Calçados", icon: <FaShoePrints/> }, 
  { value: "Cinema", label: "Cinema", icon: <FaFilm/> },
  { value: "Combustivel", label: "Combustível", icon: <FaGasPump /> },
  { value: "Conserto", label: "Conserto", icon: <FaWrench /> },
  { value: "Condominio", label: "Condomínio", icon: <FaBuilding /> },
  { value: "CompraMes", label: "Compra Mês", icon: <FaShoppingCart /> },
  { value: "Corem", label: "Corem", icon: <FaFileInvoiceDollar /> },
  { value: "CorteCabelo", label: "Corte de Cabelo", icon: <FaScissors /> },
  { value: "Creditos", label: "Créditos", icon: <FaCreditCard /> },
  { value: "Cursos", label: "Cursos", icon: <FaLaptopCode /> },
  { value: "Energia", label: "Energia", icon: <FaBolt /> },
  { value: "Escola", label: "Escola", icon: <FaBook /> },
  { value: "Farmacia", label: "Farmácia", icon: <FaPrescriptionBottle /> },
  { value: "FinanciamentoCarro", label: "Financiamento Carro", icon: <FaCar /> },
  { value: "FinanciamentoCasa", label: "Financiamento Casa", icon: <FaBuilding /> },
  { value: "FinanciamentoMoto", label: "Financiamento Moto", icon: <FaMotorcycle /> },
  { value: "Funcionario", label: "Funcionário", icon: <FaUser /> },
  { value: "Gas", label: "Gás", icon: <FaFire /> },
  { value: "IPTU", label: "IPTU", icon: <FaFileInvoice /> },
  { value: "IPVA", label: "IPVA", icon: <FaFileInvoiceDollar /> },
  { value: "Internet", label: "Internet", icon: <FaWifi /> },
  { value: "Lanches", label: "Lanches", icon: <FaHamburger /> },
  { value: "Lixo", label: "Lixo", icon: <FaTrash /> }, 
  { value: "Multa", label: "Multa", icon: <FaExclamationTriangle /> },
  { value: "Oficina", label: "Oficina", icon: <FaTools /> },
  { value: "Padaria", label: "Padaria", icon: <FaShoppingBasket /> },
  { value: "PlanoSaude", label: "Plano de Saúde", icon: <FaHospital /> },
  { value: "RacaoPet", label: "Ração Pet", icon: <FaDog /> },
  { value: "Restaurante", label: "Restaurante", icon: <FaUtensils /> },
  { value: "Transporte", label: "Transporte", icon: <FaBus /> },
  { value: "Feira", label: "Feira", icon: <FaStore /> },
  { value: "Uber", label: "Uber", icon: <FaUber /> },
  { value: "Streamers", label: "Streamers", icon: <FaPlayCircle /> },
  { value: "Roupas", label: "Roupas", icon: <FaTshirt /> },
  { value: "Joias", label: "Joias", icon: <FaGem /> },
  { value: "SalaoBeleza", label: "Salão de Beleza", icon: <FaSpa /> },
  { value: "Praia", label: "Praia", icon: <FaUmbrellaBeach /> },
  { value: "Viagem", label: "Viagem", icon: <FaPlane /> },
  { value: "Presente", label: "Presente", icon: <FaGift/> },
];

// ====== Animação de piscar ======
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

// ====== Wrapper Glass ======
const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;      
  gap: 1px;            
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.57);
  backdrop-filter: blur(10px);       
  justify-content: flex-start; 
`;

const GastoIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "hasTransacao" && prop !== "percent",
})`
  position: relative;
  font-size: 12;
  cursor: pointer;
  width: 30px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ percent }) =>
    percent > 50 ? "#f44336" :
    percent > 25 ? "#ff9800" :
    "rgba(40, 90, 141, 0.61)"};

  border: ${({ hasTransacao }) =>
    hasTransacao ? "1px solid rgb(74, 223, 28)" : "none"};
  border-radius: 50%;

  ${({ percent }) =>
    percent > 50 &&
    css`
      animation: ${blink} 1s infinite;
      border: 1px solid rgb(235, 39, 13);
    `}

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0,0,0,0.75);
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    font-size: 12px;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
  }
`;

const AvaliacCustumDashboard = ({ mesSelecionado, anoSelecionado, transacoes }) => {
  const [percentuais, setPercentuais] = useState({});

  useEffect(() => {
    if (!transacoes) return;

    const ganhosMes = transacoes
      .filter(t => t.tipo === "ganho" &&
        t.data.getMonth() === mesSelecionado &&
        t.data.getFullYear() === anoSelecionado)
      .reduce((acc, t) => acc + t.valor, 0);

    const novosPercentuais = {};
    for (let g of gastos) {
      const gastoTotal = transacoes
        .filter(t => t.tipo === "gasto" &&
          t.descricao === g.value &&
          t.data.getMonth() === mesSelecionado &&
          t.data.getFullYear() === anoSelecionado)
        .reduce((acc, t) => acc + t.valor, 0);
      novosPercentuais[g.value] = ganhosMes ? (gastoTotal / ganhosMes) * 100 : 0;
    }
    setPercentuais(novosPercentuais);
  }, [transacoes, mesSelecionado, anoSelecionado]);

  return (
    <Wrapper>
      {gastos.map((g) => {
        const hasTransacao = transacoes?.some(
          t => t.tipo === "gasto" &&
               t.descricao === g.value &&
               t.data.getMonth() === mesSelecionado &&
               t.data.getFullYear() === anoSelecionado
        );

        return (
          <GastoIcon
            key={g.value}
            percent={percentuais[g.value] || 0}
            hasTransacao={hasTransacao}
            data-tooltip={`${g.label}: ${(percentuais[g.value] || 0).toFixed(1)}%`}
          >
            {g.icon}
          </GastoIcon>
        );
      })}
    </Wrapper>
  );
};

export default AvaliacCustumDashboard;
