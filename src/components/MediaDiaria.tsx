"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { FaCalendarDay } from "react-icons/fa";

const Card = styled.div`
  background: linear-gradient(135deg, #3f677a, rgba(63, 103, 122, 0.18));
  color: white;
  padding: 6px 10px;
  border-radius: 12px;
  width: 120px;
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

interface MediaDiariaProps {
  mesAtual: number;
  anoAtual: number;
}

const MediaDiaria: React.FC<MediaDiariaProps> = ({ mesAtual, anoAtual }) => {
  const { user } = useAuth();
  const [mediaDiaria, setMediaDiaria] = useState<number | null>(null);

  useEffect(() => {
    const fetchGanhos = async () => {
      if (!user) return;

      try {
        const transacoesRef = collection(db, "transacoes");

        // Consulta ganhos do usuário para o mês e ano atuais
        const q = query(
          transacoesRef,
          where("userId", "==", user.uid),
          where("tipo", "==", "ganho")
        );
        const snapshot = await getDocs(q);

        let totalGanhosMes = 0;

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
            totalGanhosMes += data.valor || 0;
          }
        });

        const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
        const media = diasNoMes > 0 ? totalGanhosMes / diasNoMes : 0;
        setMediaDiaria(media);
      } catch (err) {
        console.error("Erro ao calcular média diária:", err);
      }
    };

    fetchGanhos();
  }, [user, mesAtual, anoAtual]); //  Recarrega sempre que muda mês ou ano

  return (
    <Card>
      <Info>
        <span>Ganho diário</span>
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

export default MediaDiaria;
