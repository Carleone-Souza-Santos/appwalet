"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaList, FaPen, FaPlus } from "react-icons/fa";
import DividaManager from "@/components/Divida";
import DividaList from "@/components/DividaList";

// ======== ESTILOS ========
const Wrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  z-index: 100;
`;

const expandAnim = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const IconButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "bgColor" && prop !== "expanded",
}) <{ bgColor?: string; expanded?: boolean }>`
  background: ${({ bgColor }) => bgColor || "linear-gradient(145deg,rgba(255,255,255,0.12)0%,rgb(23,59,77)100%)"};
  border: none;
  border-radius: 50%;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  animation: ${({ expanded }) => (expanded ? "scale(1);opacity:1;" : "none")} 0.2s ease-out;
`;

const SecondaryButtons = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "expanded",
}) <{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: ${({ expanded }) => (expanded ? "auto" : "none")};
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  transition: opacity 0.2s;
`;

// ======== COMPONENTE PAI ========
const DividaWrapper: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [openManager, setOpenManager] = useState(false);
  const [openList, setOpenList] = useState(false);

  return (
    <>
      <Wrapper>
        {/* Botões secundários */}
        <SecondaryButtons expanded={expanded}>
          <IconButton
            bgColor="#3f677a"
            expanded={expanded}
            onClick={() => setOpenManager(true)}
          >
            <FaPen />
          </IconButton>

          <IconButton
            bgColor="#3f677a"
            expanded={expanded}
            onClick={() => setOpenList(true)}
          >
            <FaList />
          </IconButton>
        </SecondaryButtons>

        {/* Botão principal */}
        <IconButton
          onClick={() => setExpanded(!expanded)}
          bgColor="#3f677a"
        >
          <FaPlus />
        </IconButton>
      </Wrapper>

      {/* Modais */}
      {openManager && <DividaManager closeModal={() => setOpenManager(false)} />}
      {openList && <DividaList closeModal={() => setOpenList(false)} />}
    </>
  );
};

export default DividaWrapper;
