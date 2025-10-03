"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  animation: ${fadeIn} 0.35s ease-out;
  max-width: 420px;
  width: 90%;
  text-align: center;
  position: relative;
  border: 1px solid #d1d1d1;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  width: 30px; height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  &:hover { background: #e0e0e0; }
`;

const IconWrapper = styled.div`
  background: #ff6b6b;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

const Message = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
`;

interface Props {
  message: string;
  onClose: () => void;
}

const AlertInfo: React.FC<Props> = ({ message, onClose }) => {
  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><FaTimes size={14} /></CloseButton>
        <IconWrapper>
          <FaExclamationCircle />
        </IconWrapper>
        <Message>{message}</Message>
      </ModalContainer>
    </Overlay>
  );
};

export default AlertInfo;
