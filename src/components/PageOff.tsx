"use client";

import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  background-color: #f5f5f5;
  color: #333;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-top: 1rem;
`;

export default function PageOff() {
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Sem conexão com a internet</Subtitle>
    </Container>
  );
}
