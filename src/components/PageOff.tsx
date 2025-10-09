"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { FaExclamationTriangle } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  color: #333;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const IconWrapper = styled.div`
  font-size: 6rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-top: 1rem;
  color: #555;
`;

const Info = styled.p`
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #777;
`;

export default function PageOff() {
  return (
    <Container>
      <IconWrapper>
        <FaExclamationTriangle />
      </IconWrapper>
      <Title>404</Title>
      <Subtitle>Sem conexão com a internet</Subtitle>
      <Info>Verifique sua conexão e tente novamente.</Info>
    </Container>
  );
}
