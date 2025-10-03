"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { FaWallet, FaMoneyBillWave, FaShoppingCart, FaCreditCard, FaTimes } from "react-icons/fa";

// ===================== Styled Components =====================
const blink = keyframes`
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
`;

const FormContainer = styled.form<{ minimized?: boolean }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  margin-bottom: 20px;
  align-items: center;
  background-color: #f9f9f9;
  padding: ${({ minimized }) => (minimized ? "5px" : "15px")};
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index:999;
  width: ${({ minimized }) => (minimized ? "50px" : "100%")};
  height: ${({ minimized }) => (minimized ? "50px" : "auto")};
  justify-content: ${({ minimized }) => (minimized ? "center" : "flex-start")};
  cursor: ${({ minimized }) => (minimized ? "pointer" : "default")};
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 10001;
  transition: 0.2s;
  &:hover {
    background: #f0f0f0;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  top: -20px;
  font-size: 0.65rem;
  background: rgb(39, 103, 133);
  color: #fff;
  padding: 1px 5px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;
`;

const MinimizedWrapper = styled.div`
  position: fixed; 
  bottom: 20px;    
  right: 20px;     
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  z-index: 10001;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const BlinkArrow = styled.span`
  margin-left: 5px;
  font-size: 1rem;
  color: red; /* seta vermelha */
  animation: blink 2s infinite;

  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 150px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #628292;
    box-shadow: 0 0 4px rgba(113, 219, 116, 0.5);
  }
`;

const SelectContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 150px;
`;

const SelectButton = styled.button<{ tipo?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
    z-index:999;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border-radius: 8px;

`;

const OptionItem = styled.li<{ active?: boolean }>`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
   z-index: 10001;
  background-color: ${({ active }) => (active ? "#f0f0f0" : "#fff")};
  &:hover {
    background-color: #e0e0e0;
  }
  z-index: 199999; 
`;

const Button = styled.button<{ tipo?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background-color: ${({ tipo }) =>
    tipo === "gasto" ? "#F44336" :
      tipo === "parcelado" ? "#FFB300" :
        tipo === "deposito" ? "#3F51B5" :
          "#4CAF50"};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
  transition: all 0.2s;
  &:hover {
    background-color: ${({ tipo }) =>
    tipo === "gasto" ? "#d32f2f" :
      tipo === "parcelado" ? "#ffa000" :
        tipo === "deposito" ? "#303F9F" :
          "#45a049"};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BankLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  background-color: #628292;
  justify-content: center;
  
   
`;

const tipos = [
  { value: "ganho", label: "Ganho", icon: <FaMoneyBillWave /> },
  { value: "gasto", label: "Gasto", icon: <FaShoppingCart /> },
  { value: "parcelado", label: "Parcelado", icon: <FaCreditCard /> },
  { value: "deposito", label: "Depósito", icon: <FaWallet /> },
];

interface Props {
  refresh: () => void;
}

const TransacaoForm: React.FC<Props> = ({ refresh }) => {
  const { user } = useAuth();
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [tipo, setTipo] = useState<"" | "ganho" | "gasto" | "parcelado" | "deposito">("");
  const [vezes, setVezes] = useState(1);
  const [openSelect, setOpenSelect] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const isFormValid = descricao.trim() !== "" && valor !== "" && tipo !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isFormValid) return;

    try {
      if (tipo === "parcelado") {
        const valorParcela = Number(valor) / vezes;
        const hoje = new Date();

        for (let i = 0; i < vezes; i++) {
          const dataParcela = new Date(hoje);
          dataParcela.setMonth(dataParcela.getMonth() + i);

          await addDoc(collection(db, "transacoes"), {
            descricao: `${descricao} (Parcela ${i + 1}/${vezes})`,
            valor: valorParcela,
            tipo: "parcelado",
            userId: user.uid,
            data: Timestamp.fromDate(dataParcela),
            parcelado: true,
          });
        }
      } else {
        await addDoc(collection(db, "transacoes"), {
          descricao,
          valor: Number(valor),
          tipo,
          userId: user.uid,
          data: Timestamp.fromDate(new Date()),
        });
      }

      setDescricao("");
      setValor("");
      setTipo("");
      setVezes(1);
      refresh();
      setMinimized(true);
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
    }
  };

  const renderIcon = () => {
    switch (tipo) {
      case "ganho": return <FaMoneyBillWave />;
      case "gasto": return <FaShoppingCart />;
      case "parcelado": return <FaCreditCard />;
      case "deposito": return <FaWallet />;
      default: return <FaWallet />;
    }
  };

  if (minimized) {
    return (
      <MinimizedWrapper onClick={() => setMinimized(false)}>
        <FaWallet size={20} color="#628292" />
        <BlinkArrow>⬅</BlinkArrow>
        <Tooltip>Formulário</Tooltip>
      </MinimizedWrapper>
    );
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <CloseButton type="button" onClick={() => setMinimized(true)}>
        <FaTimes size={14} />
      </CloseButton>

      <Input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
      />

      <SelectContainer>
        <SelectButton type="button" onClick={() => setOpenSelect(!openSelect)}>
          <span>{tipo ? tipos.find(t => t.value === tipo)?.icon : null} {tipo ? tipos.find(t => t.value === tipo)?.label : "Selecione o tipo"}</span>
          <span>▼</span>
        </SelectButton>
        {openSelect && (
          <OptionsList>
            {tipos.map(t => (
              <OptionItem
                key={t.value}
                onClick={() => { setTipo(t.value as any); setOpenSelect(false); }}
              >
                {t.icon} {t.label}
              </OptionItem>
            ))}
          </OptionsList>
        )}
      </SelectContainer>

      {tipo === "parcelado" && (
        <Input
          type="number"
          placeholder="Parcelas (1-60)"
          min={1}
          max={60}
          value={vezes}
          onChange={(e) => setVezes(Number(e.target.value))}
        />
      )}

      {tipo === "deposito" && (
        <BankLabel>
          <FaWallet /> Banco
        </BankLabel>
      )}

      <Button type="submit" tipo={tipo} disabled={!isFormValid}>
        {renderIcon()} Adicionar
      </Button>
    </FormContainer>
  );
};

export default TransacaoForm;
