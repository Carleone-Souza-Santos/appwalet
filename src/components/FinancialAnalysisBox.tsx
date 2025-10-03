import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Box = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-top: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
`;

const Header = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
  min-width: 70px;
  padding: 6px;
  border-radius: 6px;
  background: #f9f9f9;
  margin: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 0.85rem;
`;

const Select = styled.select`
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.85rem;
  cursor: pointer;
  background-color: #fff;
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

interface MonthData {
  mes: string;
  ganho: number;
  gasto: number;
  deposito?: number;
  economia: number;
}

interface Props {
  data: MonthData[];
}

export const FinancialAnalysisBox: React.FC<Props> = ({ data }) => {
  const [mesesSelecionados, setMesesSelecionados] = useState<number>(12);
  const [chartKey, setChartKey] = useState<number>(0);

  // Atualiza o gráfico a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setChartKey(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data || data.length === 0) return null;

  const mesesOrdem = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const dataOrdenada = useMemo(() => {
    return [...data].sort((a, b) => mesesOrdem.indexOf(a.mes) - mesesOrdem.indexOf(b.mes));
  }, [data]);

  const dataFiltrada = useMemo(() => {
    const totalMeses = Math.min(mesesSelecionados, dataOrdenada.length);
    return dataOrdenada.slice(-totalMeses).map((d, i, arr) => ({
      ...d,
      prevEconomia: i > 0 ? arr[i - 1].economia : null
    }));
  }, [dataOrdenada, mesesSelecionados]);

  const maiorGanho = Math.max(...dataFiltrada.map(d => d.ganho));
  const mesMaiorGanho = dataFiltrada.find(d => d.ganho === maiorGanho)?.mes || "";

  const maiorGasto = Math.max(...dataFiltrada.map(d => d.gasto));
  const mesMaiorGasto = dataFiltrada.find(d => d.gasto === maiorGasto)?.mes || "";

  const maiorDeposito = Math.max(...dataFiltrada.map(d => d.deposito || 0));
  const mesMaiorDeposito = dataFiltrada.find(d => (d.deposito || 0) === maiorDeposito)?.mes || "";

  const maiorEconomia = Math.max(...dataFiltrada.map(d => d.economia));
  const mesMaiorEconomia = dataFiltrada.find(d => d.economia === maiorEconomia)?.mes || "";

  const getTrendIcon = (current: number, previous: number | null) => {
    if (previous === null) return null;
    return current >= previous ? <FaArrowUp color="#4CAF50" /> : <FaArrowDown color="#F44336" />;
  };

  return (
    <Box>
      <Header>
        <div>Análise últimos {mesesSelecionados} mês(es)</div>
        <Select
          value={mesesSelecionados}
          onChange={(e) => setMesesSelecionados(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>{m} mês(es)</option>
          ))}
        </Select>
      </Header>

      <Stats>
        <StatItem>
          <div>Maior Ganho</div>
          <strong style={{ color: "#4CAF50" }}>R$ {maiorGanho.toFixed(2)}</strong>
          <div>{mesMaiorGanho}</div>
        </StatItem>
        <StatItem>
          <div>Maior Gasto</div>
          <strong style={{ color: "#F44336" }}>R$ {maiorGasto.toFixed(2)}</strong>
          <div>{mesMaiorGasto}</div>
        </StatItem>
        <StatItem>
          <div>Maior Depósito</div>
          <strong style={{ color: "#9C27B0" }}>R$ {maiorDeposito.toFixed(2)}</strong>
          <div>{mesMaiorDeposito}</div>
        </StatItem>
        <StatItem>
          <div>Maior Economia</div>
          <strong style={{ color: "#2196F3" }}>R$ {maiorEconomia.toFixed(2)}</strong>
          <div>{mesMaiorEconomia}</div>
        </StatItem>
      </Stats>

      <ResponsiveContainer width="100%" height={100}>
        <LineChart
          key={chartKey} // chave que força atualização a cada 10s
          data={dataFiltrada}
          margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const economiaAtual = payload.find(p => p.dataKey === "economia")?.value ?? 0;
                const economiaAnterior = payload.find(p => p.dataKey === "economia")?.payload?.prevEconomia ?? null;
                const trendIcon = getTrendIcon(economiaAtual, economiaAnterior);
                const depositoAtual = payload.find(p => p.dataKey === "deposito")?.value ?? 0;
                return (
                  <div style={{ background: "#fff", padding: 6, border: "1px solid #ccc", borderRadius: 4, fontSize: "0.85rem" }}>
                    <div><strong>{label}</strong> {trendIcon}</div>
                    <div>Ganho: <strong style={{ color: "#4CAF50" }}>R$ {payload.find(p => p.dataKey === "ganho")?.value}</strong></div>
                    <div>Gasto: <strong style={{ color: "#F44336" }}>R$ {payload.find(p => p.dataKey === "gasto")?.value}</strong></div>
                    <div>Depósito: <strong style={{ color: "#9C27B0" }}>R$ {depositoAtual}</strong></div>
                    <div>Economia: <strong style={{ color: "#2196F3" }}>R$ {economiaAtual}</strong></div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line type="monotone" dataKey="ganho" stroke="#4CAF50" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="gasto" stroke="#F44336" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="deposito" stroke="#9C27B0" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="economia" stroke="#2196F3" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
