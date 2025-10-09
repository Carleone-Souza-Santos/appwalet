"use client";

import React from "react";
import { Transacao } from "../types/Transacao";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import {
  FaDumbbell, FaWater, FaHome, FaCoffee, FaShoePrints, FaFilm, FaGasPump,
  FaWrench, FaBuilding, FaShoppingCart, FaFileInvoiceDollar, FaCreditCard, FaLaptopCode,
  FaBolt, FaBook, FaPrescriptionBottle, FaCar, FaMotorcycle, FaUser, FaFire, FaFileInvoice,
  FaWifi, FaHamburger, FaTrash, FaExclamationTriangle, FaTools, FaShoppingBasket, FaHospital,
  FaDog, FaUtensils, FaBus, FaStore, FaUber, FaPlayCircle, FaTshirt, FaGem, FaSpa,
  FaUmbrellaBeach, FaPlane, FaGift
} from "react-icons/fa";
import { FaScissors as FaScissors6 } from "react-icons/fa6";

const ChartContainer = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto; /* centraliza horizontalmente */
  display: flex;
  align-items: center; /* centraliza verticalmente */
  justify-content: center; /* centraliza horizontalmente */
`;


export const gastos = [
  { value: "Academia", label: "Academia", icon: <FaDumbbell />, color: "#F44336" },
  { value: "Agua", label: "Água", icon: <FaWater />, color: "#2196F3" },
  { value: "Aluguel", label: "Aluguel", icon: <FaHome />, color: "#9C27B0" },
  { value: "Cafe", label: "Café", icon: <FaCoffee />, color: "#FF9800" },
  { value: "Calcados", label: "Calçados", icon: <FaShoePrints />, color: "#FF5722" },
  { value: "Cinema", label: "Cinema", icon: <FaFilm />, color: "#E91E63" },
  { value: "Combustivel", label: "Combustível", icon: <FaGasPump />, color: "#3F51B5" },
  { value: "Conserto", label: "Conserto", icon: <FaWrench />, color: "#607D8B" },
  { value: "Condominio", label: "Condomínio", icon: <FaBuilding />, color: "#795548" },
  { value: "CompraMes", label: "Compra Mês", icon: <FaShoppingCart />, color: "#FFEB3B" },
  { value: "Corem", label: "Corem", icon: <FaFileInvoiceDollar />, color: "#00BCD4" },
  { value: "CorteCabelo", label: "Corte de Cabelo", icon: <FaScissors6 />, color: "#CDDC39" },
  { value: "Creditos", label: "Créditos", icon: <FaCreditCard />, color: "#673AB7" },
  { value: "Cursos", label: "Cursos", icon: <FaLaptopCode />, color: "#F44336" },
  { value: "Energia", label: "Energia", icon: <FaBolt />, color: "#FF9800" },
  { value: "Escola", label: "Escola", icon: <FaBook />, color: "#03A9F4" },
  { value: "Farmacia", label: "Farmácia", icon: <FaPrescriptionBottle />, color: "#009688" },
  { value: "FinanciamentoCarro", label: "Financiamento Carro", icon: <FaCar />, color: "#E91E63" },
  { value: "FinanciamentoCasa", label: "Financiamento Casa", icon: <FaBuilding />, color: "#795548" },
  { value: "FinanciamentoMoto", label: "Financiamento Moto", icon: <FaMotorcycle />, color: "#FF5722" },
  { value: "Funcionario", label: "Funcionário", icon: <FaUser />, color: "#4CAF50" },
  { value: "Gas", label: "Gás", icon: <FaFire />, color: "#F44336" },
  { value: "IPTU", label: "IPTU", icon: <FaFileInvoice />, color: "#9C27B0" },
  { value: "IPVA", label: "IPVA", icon: <FaFileInvoiceDollar />, color: "#FFC107" },
  { value: "Internet", label: "Internet", icon: <FaWifi />, color: "#03A9F4" },
  { value: "Lanches", label: "Lanches", icon: <FaHamburger />, color: "#FF9800" },
  { value: "Lixo", label: "Lixo", icon: <FaTrash />, color: "#607D8B" },
  { value: "Multa", label: "Multa", icon: <FaExclamationTriangle />, color: "#F44336" },
  { value: "Oficina", label: "Oficina", icon: <FaTools />, color: "#795548" },
  { value: "Padaria", label: "Padaria", icon: <FaShoppingBasket />, color: "#FFEB3B" },
  { value: "PlanoSaude", label: "Plano de Saúde", icon: <FaHospital />, color: "#4CAF50" },
  { value: "RacaoPet", label: "Ração Pet", icon: <FaDog />, color: "#9C27B0" },
  { value: "Restaurante", label: "Restaurante", icon: <FaUtensils />, color: "#FF5722" },
  { value: "Transporte", label: "Transporte", icon: <FaBus />, color: "#03A9F4" },
  { value: "Feira", label: "Feira", icon: <FaStore />, color: "#FF9800" },
  { value: "Uber", label: "Uber", icon: <FaUber />, color: "#607D8B" },
  { value: "Streamers", label: "Streamers", icon: <FaPlayCircle />, color: "#9C27B0" },
  { value: "Roupas", label: "Roupas", icon: <FaTshirt />, color: "#E91E63" },
  { value: "Joias", label: "Joias", icon: <FaGem />, color: "#FFC107" },
  { value: "SalaoBeleza", label: "Salão de Beleza", icon: <FaSpa />, color: "#FFEB3B" },
  { value: "Praia", label: "Praia", icon: <FaUmbrellaBeach />, color: "#03A9F4" },
  { value: "Viagem", label: "Viagem", icon: <FaPlane />, color: "#F44336" },
  { value: "Presente", label: "Presente", icon: <FaGift />, color: "#FF9800" },
];

// Lista de ganhos
export const ganhos = [
  { value: "Salario", label: "Salário", color: "#83c886" },
  { value: "Premiacao", label: "Premiação", color: "#4ad64f" },
  { value: "Freelance", label: "Freelance", color: "#0e8412" },
  { value: "Servicos", label: "Serviços", color: "#042805" },
  { value: "Vendas", label: "Vendas", color: "#245425" },
];

interface Props {
  transacoes: Transacao[];
  mesSelecionado: number;
  anoSelecionado: number;
}

const MonthlyPieChart: React.FC<Props> = ({ transacoes, mesSelecionado, anoSelecionado }) => {
  const transacoesDoMes = transacoes.filter(
    t => t.data.getMonth() === mesSelecionado && t.data.getFullYear() === anoSelecionado
  );

  const gastosDoMes = gastos.map(g => {
    const total = transacoesDoMes
      .filter(t => t.tipo === "gasto" && t.descricao === g.value)
      .reduce((acc, t) => acc + t.valor, 0);
    return { ...g, total };
  }).filter(g => g.total > 0);

  const ganhosDoMes = ganhos.map(g => {
    const total = transacoesDoMes
      .filter(t => t.tipo === "ganho" && t.descricao === g.value)
      .reduce((acc, t) => acc + t.valor, 0);
    return { ...g, total };
  }).filter(g => g.total > 0);

  const dadosDoMes = [...gastosDoMes, ...ganhosDoMes];

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dadosDoMes}
            dataKey="total"
            nameKey="label"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            label={(entry) => `${entry.label} (${entry.total.toFixed(2)})`}
          >
            {dadosDoMes.map(entry => (
              <Cell key={entry.value} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MonthlyPieChart;
