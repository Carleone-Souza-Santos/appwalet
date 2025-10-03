"use client";

import React from "react";
import { Transacao } from "../types/Transacao";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styled, { keyframes } from "styled-components";

const ChartContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
`;

// Animação de piscar
const blink = keyframes`
  0%, 100% { fill: black; }
  50% { fill: white; }
`;

const AnimatedText = styled.text`
  animation: ${blink} 1s infinite;
`;

interface Props {
  transacoes: Transacao[];
  mesSelecionado: number;
  anoSelecionado: number;
}

// Cores fixas por categoria
const CATEGORY_COLORS: { [key: string]: string } = {
  Ganho: "#4CAF50",     // verde
  Gasto: "#F44336",     // vermelho
  Parcelado: "#FFCE56", // amarelo
  Depósito: "#9C27B0",  // roxo
};

const MonthlyPieChart: React.FC<Props> = ({ transacoes, mesSelecionado, anoSelecionado }) => {
  const transacoesDoMes = transacoes.filter(
    t => t.data.getMonth() === mesSelecionado && t.data.getFullYear() === anoSelecionado
  );

  const data = [
    { name: "Ganho", value: transacoesDoMes.filter(t => t.tipo === "ganho").reduce((acc, t) => acc + t.valor, 0) },
    { name: "Gasto", value: transacoesDoMes.filter(t => t.tipo === "gasto").reduce((acc, t) => acc + t.valor, 0) },
    { name: "Parcelado", value: transacoesDoMes.filter(t => t.tipo === "parcelado").reduce((acc, t) => acc + t.valor, 0) },
    { name: "Depósito", value: transacoesDoMes.filter(t => t.tipo === "deposito").reduce((acc, t) => acc + t.valor, 0) },
  ];

  const renderLabelInside = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent === 0) return null;

    return (
      <AnimatedText
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </AnimatedText>
    );
  };

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={4}
            label={renderLabelInside}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MonthlyPieChart;
