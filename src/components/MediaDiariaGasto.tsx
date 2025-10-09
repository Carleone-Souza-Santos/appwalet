"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { FaCalendarDay } from "react-icons/fa";

const Card = styled.div`
  background: linear-gradient(135deg, #7a3f3f, rgba(122, 63, 63, 0.18));
  color: white;
  padding: 6px 10px;
  border-radius: 12px;
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-size: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Valor = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

interface MediaDiariaGastoProps {
  mesAtual: number;
  anoAtual: number;
}

const MediaDiariaGasto: React.FC<MediaDiariaGastoProps> = ({ mesAtual, anoAtual }) => {
  const { user } = useAuth();
  const [mediaDiaria, setMediaDiaria] = useState<number | null>(null);

  useEffect(() => {
    const fetchGastos = async () => {
      if (!user) return;

      try {
        const transacoesRef = collection(db, "transacoes");

        // Consulta gastos do usuário para o mês e ano atuais
        const q = query(
          transacoesRef,
          where("userId", "==", user.uid),
          where("tipo", "in", ["gasto", "parcelado"]) // considera gastos e parcelas
        );

        const snapshot = await getDocs(q);

        let totalGastosMes = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data() as any;
          const dataTransacao = data.data?.toDate
            ? data.data.toDate()
            : new Date(data.data);

          if (
            dataTransacao &&
            dataTransacao.getMonth() === mesAtual &&
            dataTransacao.getFullYear() === anoAtual
          ) {
            totalGastosMes += data.valor || 0;
          }
        });

        const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
        const media = diasNoMes > 0 ? totalGastosMes / diasNoMes : 0;
        setMediaDiaria(media);
      } catch (err) {
        console.error("Erro ao calcular média diária de gastos:", err);
      }
    };

    fetchGastos();
  }, [user, mesAtual, anoAtual]);

  return (
    <Card>
      <Info>
        <span>Gasto diário</span>
        <Valor>
          {mediaDiaria !== null
            ? mediaDiaria.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
            : "Carregando..."}
        </Valor>
      </Info>
      <FaCalendarDay size={16} />
    </Card>
  );
};

export default MediaDiariaGasto;
