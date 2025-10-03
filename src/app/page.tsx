"use client";

import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/assets/Background.jpg') center/cover no-repeat;
  color: #fff;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Text = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin: 0 10px;
  padding: 12px 30px;
  font-size: 1rem;
  color: #fff;
  background-color: #00090D;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #15455c;
    transform: translateY(-2px);
  }
`;

export default function Home() {
  return (
    <Container>
      <Title>Bem-vindo / Wallet 0.2</Title>
      <Text>Gerencie suas finanças de forma fácil e segura</Text>
      <div>
        <StyledLink href="/login">Login</StyledLink>
        <StyledLink href="/registro">Registro</StyledLink>
      </div>
    </Container>
  );
}
