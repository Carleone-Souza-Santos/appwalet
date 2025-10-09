"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes } from "react-icons/fa";

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
  z-index: 500;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 25px 30px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  animation: ${fadeIn} 0.2s ease-out;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute; top: 12px; right: 12px;
  background: none; border: none;
  font-size: 18px; cursor: pointer; color: #f44336;
`;

const Label = styled.label`
  display: block;
  margin: 15px 0 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
`;

const Slider = styled.input`
  width: 100%;
  margin-top: 10px;
`;

const Resultado = styled.div`
  margin-top: 15px;
  font-weight: bold;
  font-size: 1rem;
  color: #2196f3;
  text-align: center;
`;

// ======== COMPONENTE ========
interface Props {
  closeModal: () => void;
  valorTotal: number;
  banco: string;
}

const SolucionadorFinanceiro: React.FC<Props> = ({ closeModal, valorTotal, banco }) => {
  const [meses, setMeses] = useState(1);

  const parcela = valorTotal / meses;

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
        <h3>Solução Financeira - {banco}</h3>

        <Label>Valor da dívida:</Label>
        <Input type="text" value={valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} readOnly />

        <Label>Parcelas (meses): {meses}</Label>
        <Slider
          type="range"
          min={1}
          max={24}
          value={meses}
          onChange={(e) => setMeses(Number(e.target.value))}
        />

        <Resultado>
          Cada parcela ficará: {parcela.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </Resultado>
      </ModalContainer>
    </Overlay>
  );
};

export default SolucionadorFinanceiro;
