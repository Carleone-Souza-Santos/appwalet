"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const Modal = styled.div`
  position: relative;
  background: #fff;
  padding: 24px 20px;
  border-radius: 12px;
  width: 320px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  animation: ${fadeIn} 0.25s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #777;
  font-size: 1.1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #e53935;
  }
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #333;
`;

const Message = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Button = styled.button<{ color?: string }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  background: ${({ color }) => color || "#2196F3"};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;


interface Props {
  // Função chamada quando o usuário decide cancelar a ação
  onCancel: () => void;

  // Função chamada quando o usuário confirma a exclusão
  onConfirm: () => void;
}

// Componente modal para confirmar exclusão de uma transação
export const ConfirmDeleteModal: React.FC<Props> = ({ onCancel, onConfirm }) => {


  // ====== Função que lida com a confirmação ======
  const handleConfirm = () => {
    // Toca um efeito sonoro ao confirmar (RDR2)
    const audio = new Audio("/sound/quick-ting.mp3");
    audio.play().catch(err => console.log("Erro ao tocar som:", err));

    // Chama a função de confirmação passada como prop
    onConfirm();
  };

  return (
    <Overlay>
      <Modal>
        {/* Botão de fechar modal */}
        <CloseButton onClick={onCancel}>
          <FaTimes />
        </CloseButton>

        {/* Título do modal */}
        <Title>Confirmar exclusão</Title>

        {/* Mensagem de alerta */}
        <Message>Tem certeza que deseja excluir esta transação?</Message>

        {/* Botões de ação */}
        <Buttons>
          {/* Botão de cancelar */}
          <Button color="#9e9e9e" onClick={onCancel}>Não</Button>

          {/* Botão de confirmar, que toca som */}
          <Button color="#e53935" onClick={handleConfirm}>Sim</Button>
        </Buttons>
      </Modal>
    </Overlay>
  );
};
