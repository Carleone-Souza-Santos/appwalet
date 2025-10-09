"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes } from "react-icons/fa";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

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
  width: 450px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px; right: 12px;
  background: none; border: none;
  font-size: 18px; cursor: pointer; color: #f44336;
`;

const Select = styled.select`
  padding: 10px; border-radius: 8px;
  border: 1px solid #ccc; width: 100%; margin-top: 10px;
`;

const Input = styled.input`
  padding: 10px; border-radius: 8px;
  border: 1px solid #ccc; width: 100%; margin-top: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px; border-radius: 10px; border: none;
  color: #fff; background-color: #3f677a; font-weight: 600;
  cursor: pointer; width: 100%; margin-top: 15px;
  &:hover { opacity: 0.85; }
`;

const ErrorMessage = styled.div`
  color: #f44336; font-size: 0.9rem; margin-top: 5px;
`;

// ======== BANCOS ========
const bancos = [
  "Banco do Brasil",
  "Caixa Econômica Federal",
  "Bradesco",
  "Itaú",
  "Santander",
  "Banrisul",
  "Banco Inter",
  "Nubank",
  "Original",
  "C6 Bank",
  "Next",
];

// ======== COMPONENTE ========
interface Props {
  closeModal: () => void;
}

const DividaManager: React.FC<Props> = ({ closeModal }) => {
  const { user } = useAuth();
  const [banco, setBanco] = useState("");
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");

  const formatInput = (value: string) => {
    const num = value.replace(/\D/g, "");
    return (Number(num) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => setValor(formatInput(e.target.value));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!user) return setErro("Usuário não autenticado");
    if (!banco || !valor) return setErro("Preencha todos os campos");

    const valorNum = Number(valor.replace(/[R$\s.]/g, "").replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) return setErro("Valor inválido");

    try {
      await addDoc(collection(db, "dividas"), {
        userId: user.uid,
        banco,
        valor: valorNum,
        data: Timestamp.now(),
      });
      setBanco("");
      setValor("");
      closeModal();
      window.location.reload(); // 🔹 Atualiza a página após salvar
    } catch (err) {
      console.error("Erro ao salvar dívida:", err);
      setErro("Erro ao salvar dívida");
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
        <h3>Adicionar Dívida</h3>
        <form onSubmit={handleSubmit}>
          <Select value={banco} onChange={(e) => setBanco(e.target.value)}>
            <option value="">Selecione o banco</option>
            {bancos.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
          <Input type="text" placeholder="Valor da dívida" value={valor} onChange={handleValorChange} />
          {erro && <ErrorMessage>{erro}</ErrorMessage>}
          <SubmitButton type="submit">Salvar Dívida</SubmitButton>
        </form>
      </ModalContainer>
    </Overlay>
  );
};

export default DividaManager;
