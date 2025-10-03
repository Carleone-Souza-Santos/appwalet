"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { FaTimes } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// ===================== Animações =====================
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// ===================== Styled Components =====================
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  display:flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  width: 800px;
  max-width: 95%;
  background: linear-gradient(145deg, #ffffff, #f4f8fb);
  border-radius: 16px;
  padding: 25px;
  animation: ${slideUp} 0.4s ease-out;
  box-shadow: 0 15px 35px rgba(0,0,0,0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', 'Roboto', sans-serif;
`;

const CloseButton = styled.button`
  position:absolute;
  top:15px;
  right:15px;
  border:none;
  background:#e0e6ed;
  width:35px;
  height:35px;
  border-radius:50%;
  cursor:pointer;
  display:flex;
  justify-content:center;
  align-items:center;
  transition: 0.3s;

  &:hover {
    background:#cfd8e3;
  }
`;

const Title = styled.h2`
  text-align:center;
  margin-bottom:20px;
  font-size: 1rem;
  font-weight: 700;
  color: #1b1f3b;
`;

const ChartWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const MonthCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
`;

const MonthTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1b1f3b;
  margin-bottom: 8px;
`;

const ChangeText = styled.div`
  font-size: 0.7rem;
  color: #333;
  margin-top: 6px;
`;

// ===================== Tipo para Transação =====================
interface Transacao {
  descricao: string;
  valor: number;
  tipo: "ganho" | "gasto" | "parcelado" | "deposito";
  userId: string;
  data: Timestamp;
}

interface Props {
  onClose: () => void;
}

const COLORS: Record<string, string> = {
  ganho: "#4CAF50",      // Verde
  gasto: "#FF0000",      // Vermelho
  parcelado: "#FFD700",  // Amarelo
  deposito: "#800080",   // Roxo
};

// ===================== Render label com linha =====================
const renderLabelWithLine = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name
}: any) => {
  if (percent <= 0) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <line
        x1={cx + (outerRadius - 10) * Math.cos(-midAngle * RADIAN)}
        y1={cy + (outerRadius - 10) * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke="#333"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}
        fontWeight={600}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    </>
  );
};

const ComparisonModal: React.FC<Props> = ({ onClose }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [changes, setChanges] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const transacoesRef = collection(db, "transacoes");
      const now = new Date();

      // Últimos 3 meses
      const months = [
        { name: "Atual", start: new Date(now.getFullYear(), now.getMonth(), 1), end: now },
        { name: "Mês Anterior", start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) },
        { name: "2 Meses Atrás", start: new Date(now.getFullYear(), now.getMonth() - 2, 1), end: new Date(now.getFullYear(), now.getMonth() - 1, 0) },
      ];

      const q = query(transacoesRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      let results: any[] = [];

      months.forEach(m => {
        let chartData: any[] = [];
        snapshot.forEach(doc => {
          const d = doc.data() as Transacao;
          const date = d.data.toDate();

          if (date >= m.start && date <= m.end) {
            chartData.push({
              name: d.descricao,
              value: d.valor,
              tipo: d.tipo,
            });
          }
        });

        // Transforma valores em % real do total do mês
        const total = chartData.reduce((acc, t) => acc + t.value, 0) || 1; // evita divisão por 0
        const chartPercent = chartData.map(t => ({
          ...t,
          value: (t.value / total) * 100
        }));

        results.push({ mes: m.name, chartData: chartPercent, total });
      });

      // Comparação mês a mês
      const difs: any[] = results.map((item, index) => {
        if (index === 0) return { mes: item.mes, changes: "Sem comparação" };

        const prev = results[index - 1];
        const changeObj: Record<string, string> = {};

        ["ganho", "gasto", "parcelado", "deposito"].forEach(tipo => {
          const sumCurrent = item.chartData
            .filter((t: any) => t.tipo === tipo)
            .reduce((acc: number, t: any) => acc + t.value, 0);

          const sumPrev = prev.chartData
            .filter((t: any) => t.tipo === tipo)
            .reduce((acc: number, t: any) => acc + t.value, 0);

          if (sumPrev === 0 && sumCurrent > 0) changeObj[tipo] = `↑ 100%`;
          else if (sumPrev === 0 && sumCurrent === 0) changeObj[tipo] = `0%`;
          else if (sumCurrent > sumPrev) changeObj[tipo] = `↑ ${Math.min(((sumCurrent - sumPrev) / sumPrev) * 100, 100).toFixed(1)}%`;
          else if (sumCurrent < sumPrev) changeObj[tipo] = `↓ ${Math.min(((sumPrev - sumCurrent) / sumPrev) * 100, 100).toFixed(1)}%`;
          else changeObj[tipo] = `0%`;
        });

        return { mes: item.mes, changes: changeObj };
      });

      setData(results.reverse());
      setChanges(difs.reverse());
    };

    fetchData();
  }, [user]);

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        <Title>Análise Financeira - Últimos 3 Meses</Title>

        <ChartWrapper>
          {data.map((item, index) => (
            <MonthCard key={index}>
              <MonthTitle>{item.mes}</MonthTitle>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={item.chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={renderLabelWithLine}
                  >
                    {item.chartData.map((entry: any, i: number) => (
                      <Cell key={`cell-${i}`} fill={COLORS[entry.tipo]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>

              {/* Avaliador de aumento/diminuição */}
              {changes[index] && changes[index].changes !== "Sem comparação" && (
                <ChangeText>
                  {Object.entries(changes[index].changes).map(([tipo, val]) => (
                    <div key={tipo}>
                      <span style={{ color: val.startsWith("↑") ? "green" : val.startsWith("↓") ? "red" : "#333" }}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}: {val}
                      </span>
                    </div>
                  ))}
                </ChangeText>
              )}
            </MonthCard>
          ))}
        </ChartWrapper>
      </ModalContainer>
    </Overlay>
  );
};

export default ComparisonModal;
