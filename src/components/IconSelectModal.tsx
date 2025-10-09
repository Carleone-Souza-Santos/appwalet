"use client";

import React, { JSX } from "react";
import styled, { keyframes } from "styled-components";
import { FaCreditCard, FaUniversity, FaMoneyBillWave, FaShoppingCart, FaLaptop } from "react-icons/fa";

// ======== Animações ========
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ======== Estilos ========
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10003;
  animation: ${fadeIn} 0.25s ease-out;
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg,#20333d,rgb(202, 217, 233));
  border-radius: 16px;
  padding: 20px 15px;  
  max-width: 1000px;    
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;           /* gap menor */
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.3s ease forwards;

`;

const IconButton = styled.button<{ selected?: boolean; color?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 80px;       
  max-width: 100px;    
  min-width: 80px;     
  height: 100px;       
  border-radius: 10px;
  border: ${({ selected, color }) => selected ? `2px solid ${color || "#32cf23"}` : "1px solid #ddd"};
  background: ${({ selected, color }) => selected ? `${color ? color + "33" : "#e6f9e6"}` : "#ffffff"};
  cursor: pointer;
  gap: 4px;              /* gap menor */
  transition: all 0.25s ease;
  font-weight: 500;
  box-shadow: ${({ selected, color }) => selected ? `0 4px 10px ${color ? color + "33" : "rgba(50, 207, 35, 0.3)"}` : "0 2px 5px rgba(0,0,0,0.08)"};
  position: relative;

  &:hover {
    background: ${({ selected, color }) => selected ? `${color ? color + "44" : "#d4f2d4"}` : "rgba(141, 120, 158, 0.18)"};
    transform: scale(1.06);   /* leve ajuste no hover */
    animation: ${pulse} 0.4s infinite;

  }

  span {
    font-size: 0.75rem;     
    text-align: center;
    color: ${({ selected, color }) => selected ? color || "#2e7d32" : "#444"};
    font-weight: 500;
    line-height: 1.2;
  }

  svg {
    font-size: 1.5rem;      
    color: ${({ selected, color }) => selected ? color || "#32cf23" : "#666"};
    transition: color 0.25s ease;
  }

  &::after {
    content: attr(data-label);
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(50, 50, 50, 0.9);
    color: #fff;
    padding: 3px 6px;       
    border-radius: 6px;
    font-size: 0.7rem;       
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

// ======== Tipos ========
interface Item {
  value: string;
  label: string;
  icon: JSX.Element;
  color?: string;
}

interface Props {
  items: Item[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

// ======== Componente ========
const IconSelectModal: React.FC<Props> = ({ items, selectedValue, onSelect, onClose }) => {
  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {items.map((item) => (
          <IconButton
            key={item.value}
            selected={item.value === selectedValue}
            color={item.color}
            data-label={item.label}
            onClick={() => handleSelect(item.value)}
          >
            {item.icon}
            <span>{item.label}</span>
          </IconButton>
        ))}
      </ModalContainer>
    </Overlay>
  );
};

export default IconSelectModal;
