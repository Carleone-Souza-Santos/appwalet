"use client";

import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { TransactionsSidebar } from "./MonthCard";
import KPICards from "./KPICards";
import { Transacao } from "../types/Transacao";
import TransacaoForm from "./TransacaoForm";
import { FinancialAnalysisBox } from "./FinancialAnalysisBox";
import { BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer } from "recharts";
import styled from "styled-components";
import SidebarIcons from "./SidebarIcons";
import MonthlyPieChart from "./GastosMensaisChart";
import FinancialStatus from "./VerificModal";
import BestMonthStatus from "./VerificMothGood";

const Container = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  position: relative;
  left: -80px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  align-items: center;
`;

const Select = styled.select`
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: #fff;
  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const NumberInput = styled.input`
  width: 100px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const GraficosContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());



  const fetchTransacoes = async () => {
    if (!user) return;
    const q = query(
      collection(db, "transacoes"),
      where("userId", "==", user.uid),
      orderBy("data", "asc")
    );
    const querySnapshot = await getDocs(q);
    const dados: Transacao[] = querySnapshot.docs.map(doc => {
      const dataFirestore = (doc.data() as any).data;
      return {
        id: doc.id,
        ...doc.data(),
        data: dataFirestore?.toDate ? dataFirestore.toDate() : new Date(dataFirestore),
      } as Transacao;
    });
    setTransacoes(dados);
  };

  useEffect(() => {
    fetchTransacoes();
  }, [user, refreshKey]);

  const refresh = () => setRefreshKey(prev => prev + 1);

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const transacoesDoMes = transacoes.filter(
    t => t.data.getMonth() === mesSelecionado && t.data.getFullYear() === anoSelecionado
  );

  const ganhos = transacoesDoMes.filter(t => t.tipo === "ganho").reduce((acc, t) => acc + t.valor, 0);
  const gastos = transacoesDoMes.filter(t => t.tipo === "gasto" || t.tipo === "parcelado").reduce((acc, t) => acc + t.valor, 0);
  const depositoMes = transacoesDoMes.filter(t => t.tipo === "deposito").reduce((acc, t) => acc + t.valor, 0);
  const saldo = ganhos - gastos - depositoMes;
  const parcelas = transacoesDoMes.filter(t => t.tipo === "parcelado").length;

  const totalGanhoAno = transacoes.filter(t => t.tipo === "ganho" && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
  const totalGastoAno = transacoes.filter(t => (t.tipo === "gasto" || t.tipo === "parcelado") && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
  const totalDepositoAno = transacoes.filter(t => t.tipo === "deposito" && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
  const totalParcelamentoAno = transacoes.filter(t => t.tipo === "parcelado" && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
  const percentualGastoAno = totalGanhoAno > 0 ? ((totalGastoAno + totalDepositoAno) / totalGanhoAno) * 100 : 0;

  const graficoData = meses.map((mes, i) => {
    const ganhosMes = transacoes.filter(t => t.tipo === "ganho" && t.data.getMonth() === i && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
    const gastosMes = transacoes.filter(t => (t.tipo === "gasto" || t.tipo === "parcelado") && t.data.getMonth() === i && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
    const depositoMes = transacoes.filter(t => t.tipo === "deposito" && t.data.getMonth() === i && t.data.getFullYear() === anoSelecionado).reduce((acc, t) => acc + t.valor, 0);
    return { mes, ganho: ganhosMes, gasto: gastosMes + depositoMes, deposito: depositoMes, economia: ganhosMes - gastosMes - depositoMes };
  });

  const pieData = meses.map((mes, i) => {
    const totalGastoMes = transacoes.filter(
      t => (t.tipo === "gasto" || t.tipo === "parcelado") && t.data.getMonth() === i && t.data.getFullYear() === anoSelecionado
    ).reduce((acc, t) => acc + t.valor, 0);
    return { name: mes, value: totalGastoMes };
  }).filter(d => d.value > 0);

  const onDeleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transacoes", id));
      setTransacoes(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir transação.");
    }
  };

  return (
    <Container>
      <SidebarIcons
        totalGanhoAno={totalGanhoAno}
        totalGastoAno={totalGastoAno}
        totalDepositoAno={totalDepositoAno}
        totalParcelamentoAno={totalParcelamentoAno}
        percentualGasto={percentualGastoAno}
        onClick={(index) => console.log("Ícone clicado:", index)}
      />

      <TransacaoForm refresh={refresh} />
      <KPICards saldo={saldo} ganhos={ganhos} gastos={gastos} parcelas={parcelas} />

      <FilterContainer>
        <Select value={mesSelecionado} onChange={(e) => setMesSelecionado(Number(e.target.value))}>
          {meses.map((mes, i) => <option key={i} value={i}>{mes}</option>)}
        </Select>
        <NumberInput type="number" value={anoSelecionado} min={2000} max={2100} onChange={(e) => setAnoSelecionado(Number(e.target.value))} />
      </FilterContainer>

      <BestMonthStatus transacoes={transacoes} anoSelecionado={anoSelecionado} />

      <FinancialStatus transacoes={transacoes} mesSelecionado={mesSelecionado} anoSelecionado={anoSelecionado} />

      <GraficosContainer>
        <div style={{ width: 150, height: 150 }}>
          <MonthlyPieChart transacoes={transacoes} mesSelecionado={mesSelecionado} anoSelecionado={anoSelecionado} />
        </div>

        <div style={{ flex: 1, height: 150 }}>
          <BarResponsiveContainer width="100%" height="100%">
            <BarChart data={graficoData} margin={{ top: 15, right: 15, left: 0, bottom: 0 }}>
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#666" }} axisLine={{ stroke: "#ccc" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#666" }} axisLine={{ stroke: "#ccc" }} tickLine={false} />
              <BarTooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: 8 }} itemStyle={{ color: "#333", fontWeight: 300 }} />
              <Bar dataKey="ganho" fill="#4CAF50" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="gasto" fill="#F44336" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="deposito" fill="#9C27B0" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </BarResponsiveContainer>
        </div>
      </GraficosContainer>

      <FinancialAnalysisBox data={graficoData} />

      <TransactionsSidebar
        transacoes={transacoes}
        onDeleteTransaction={onDeleteTransaction}
        mesAtual={mesSelecionado}
        setMesAtual={setMesSelecionado}
        anoAtual={anoSelecionado}
        setAnoAtual={setAnoSelecionado}
      />
    </Container>
  );
};

export default DashboardContent;
