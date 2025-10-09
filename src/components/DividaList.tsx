"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes, FaCog } from "react-icons/fa";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import SolucionadorFinanceiro from "@/components/SolucionadorFinanceiro";

// ======== ESTILOS ========
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 25px 30px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute; top: 12px; right: 12px;
  background: none; border: none;
  font-size: 18px; cursor: pointer; color: #f44336;
`;

const DividaItem = styled.div`
  display: flex; justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
`;

const Valor = styled.span`
  font-weight: bold;
  color: #3f677a;
  margin-right: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2196f3;
  font-size: 18px;
  margin-left: 8px;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.2); }
`;

const DeleteButton = styled(ActionButton)`
  color: #f44336;
`;

// ======== TIPOS ========
interface DividaType {
  id: string;
  banco: string;
  valor: number;
  data: Date;
}

interface Props {
  closeModal: () => void;
}

// ======== COMPONENTE ========
const DividaList: React.FC<Props> = ({ closeModal }) => {
  const { user } = useAuth();
  const [dividas, setDividas] = useState<DividaType[]>([]);
  const [erro, setErro] = useState("");
  const [solucaoAberta, setSolucaoAberta] = useState<DividaType | null>(null);

  // Buscar dívidas do Firestore
  const fetchDividas = async () => {
    if (!user) return;
    setErro("");

    try {
      const dividasRef = collection(db, "dividas");
      const q = query(dividasRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      const results: DividaType[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        return {
          id: docSnap.id,
          banco: data.banco,
          valor: data.valor,
          data: data.data?.toDate ? data.data.toDate() : new Date(data.data),
        };
      });

      setDividas(results);
    } catch (err: any) {
      console.error("Erro ao buscar dívidas:", err);
      setErro("Não foi possível buscar as dívidas.");
    }
  };

  useEffect(() => {
    fetchDividas();
  }, [user]);

  // Excluir dívida
  const handleDeleteDivida = async (id: string) => {
    try {
      await deleteDoc(doc(db, "dividas", id));
      setDividas((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Erro ao excluir dívida:", err);
      alert("Erro ao excluir dívida.");
    }
  };

  // Adicionar nova dívida sem recarregar
  const handleAddDivida = async (banco: string, valor: number) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "dividas"), {
        userId: user.uid,
        banco,
        valor,
        data: Timestamp.now(),
      });

      const novaDivida: DividaType = {
        id: docRef.id,
        banco,
        valor,
        data: new Date(),
      };

      setDividas((prev) => [...prev, novaDivida]);
    } catch (err) {
      console.error("Erro ao adicionar dívida:", err);
      alert("Erro ao adicionar dívida.");
    }
  };

  const formatCurrency = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <Overlay>
        <ModalContainer>
          <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
          <h3>Dívidas</h3>
          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {dividas.length === 0 ? (
            <p>Nenhuma dívida cadastrada.</p>
          ) : (
            dividas.map((d) => (
              <DividaItem key={d.id}>
                <span>{d.banco}</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Valor>{formatCurrency(d.valor)}</Valor>

                  {/* Abrir solução financeira */}
                  <ActionButton onClick={() => setSolucaoAberta(d)}>
                    <FaCog />
                  </ActionButton>

                  {/* Excluir dívida */}
                  <DeleteButton onClick={() => handleDeleteDivida(d.id)}>
                    <FaTimes />
                  </DeleteButton>
                </div>
              </DividaItem>
            ))
          )}
        </ModalContainer>
      </Overlay>

      {/* Modal de solução financeira */}
      {solucaoAberta && (
        <SolucionadorFinanceiro
          valorTotal={solucaoAberta.valor}
          banco={solucaoAberta.banco}
          closeModal={() => setSolucaoAberta(null)}
        />
      )}
    </>
  );
};

export default DividaList;
