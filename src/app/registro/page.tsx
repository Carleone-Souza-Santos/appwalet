"use client";

import React, { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "@/firebase/config"; // nosso config exporta `app`
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";

// Styled Components (mesmo que você já tinha)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: 
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('/assets/financ.jpg') center/cover no-repeat;
  padding: 20px;
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffffee;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    border-color: #032618;
    outline: none;
    box-shadow: 0 0 5px rgba(54, 63, 83, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: #032618;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgb(15, 46, 61);
    transform: translateY(-2px);
  }
`;

const AltText = styled.p`
  margin-top: 20px;
  font-size: 0.95rem;
  color: #555;

  a {
    color: #003650;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: rgb(75, 138, 170);
    }
  }
`;

const Registro: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = getAuth(app); // ⚡ pega o auth diretamente do app

  const handleRegistro = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login"); // redireciona para login após registro
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Container>
      <RegisterBox>
        <Title>Registrar</Title>
        <form onSubmit={handleRegistro}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Registrar</Button>
        </form>
        <AltText>
          Já tem conta? <Link href="/login">Entrar</Link>
        </AltText>
      </RegisterBox>
    </Container>
  );
};

export default Registro;
