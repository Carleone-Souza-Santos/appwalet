"use client";

import React from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ================= Styled Components =================

// Wrapper do gráfico com estilo de card
const ChartWrapper = styled.div`
  width: 100%;
  max-width: 400px;       // Limita a largura máxima do gráfico
  height: 200px;          // Altura fixa
  padding: 10px;          // Espaçamento interno
  background: #f9f9f9;    // Cor de fundo
  border-radius: 10px;    // Bordas arredondadas
  box-shadow: 0 2px 6px rgba(0,0,0,0.1); // Sombra suave
  font-family: sans-serif; // Fonte padrão do card
`;

// ================= Tipagem das props =================
interface Props {
  // Dados do gráfico: cada objeto representa um dia com a quantidade de cadastros
  data: { day: string; count: number }[]; // ex: [{ day: "Seg", count: 5 }, ...]
}

// ================= Componente Principal =================
const CadastroChart: React.FC<Props> = ({ data }) => {
  return (
    <ChartWrapper>
      {/* ResponsiveContainer garante que o gráfico se ajuste ao tamanho do container */}
      <ResponsiveContainer width="100%" height="100%">
        {/* BarChart é o gráfico de barras */}
        <BarChart data={data}>
          {/* XAxis: eixo horizontal (dias da semana) */}
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          {/* YAxis: eixo vertical (quantidade), sem decimais */}
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          {/* Tooltip: mostra detalhes ao passar o mouse sobre a barra */}
          <Tooltip />
          {/* Bar: define as barras do gráfico */}
          <Bar
            dataKey="count"          // Define qual campo do data será representado
            fill="#3F51B5"           // Cor das barras
            radius={[4, 4, 0, 0]}    // Arredonda os cantos superiores das barras
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default CadastroChart;
