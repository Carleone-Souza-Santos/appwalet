"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

// ==============================
//  ESTILOS
// ==============================

// Container principal (input + botões)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

// Input de valor monetário
const Input = styled.input`
  width: 150px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: right;
  transition: border 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

// Wrapper para os botões
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 12px; /* separa os botões um pouco mais */
`;

// Botões de confirmar e cancelar
const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "confirm"
}) <{ confirm?: boolean }>`
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  background-color: ${({ confirm }) => (confirm ? "#4CAF50" : "#f44336")};
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;

  &:hover {
    background-color: ${({ confirm }) => (confirm ? "#45a049" : "#d32f2f")};
  }
`;
// ==============================
//  COMPONENTE
// ==============================

interface EditTransactionInputProps {
  initialValue: number;
  onConfirm: (novoValor: number) => void;
  onCancel: () => void;
}

export const EditTransactionInput: React.FC<EditTransactionInputProps> = ({
  initialValue,
  onConfirm,
  onCancel,
}) => {
  // valor armazenado em centavos para facilitar a manipulação
  const [rawValue, setRawValue] = useState<number>(initialValue * 100);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca automaticamente no input ao renderizar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Formata valor para exibir como R$ 12,34
  const formatValue = (value: number) => {
    const reais = Math.floor(value / 100);
    const centavos = value % 100;
    return `R$ ${reais},${centavos.toString().padStart(2, "0")}`;
  };

  // Atualiza o valor conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // remove tudo que não é número
    const onlyDigits = e.target.value.replace(/\D/g, "");
    const newValue = parseInt(onlyDigits || "0", 10);
    setRawValue(newValue);
  };

  // Evita digitar caracteres inválidos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[\dBackspaceArrowLeftArrowRight]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Confirma a alteração e envia o valor para o pai
  const handleConfirm = async () => {
    setLoading(true);
    try {
      onConfirm(rawValue / 100); // converte centavos para reais
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  return (
    <Container>
      {/* Botões ficam acima do input */}
      <ButtonsWrapper>
        {/* Botão verde de confirmar */}
        <Button confirm onClick={handleConfirm} disabled={loading}>
          {loading ? "..." : "✔"}
        </Button>

        {/* Botão vermelho de cancelar */}
        <Button onClick={onCancel} disabled={loading}>
          ✖
        </Button>
      </ButtonsWrapper>

      {/* Input de valor */}
      <Input
        ref={inputRef}
        type="text"
        value={formatValue(rawValue)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
    </Container>
  );
};
