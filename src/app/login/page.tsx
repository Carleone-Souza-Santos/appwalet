"use client";

import React, { useState, FormEvent } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";

// Container que ocupa 100% da tela sem scroll
const Container = styled.div`
  height: 100vh; /* altura total da viewport */
  width: 100vw; /* largura total */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* remove scroll */
  background: 
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('/assets/contract.png') center/cover no-repeat;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

// Caixa do login
const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffffee;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  text-align: center;
`;

// Título
const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
`;

// Input estilizado
const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    border-color: #4b6cb7;
    outline: none;
    box-shadow: 0 0 5px rgba(75,108,183,0.5);
  }
`;

// Botão estilizado
const Button = styled.button`
  width: 100%;
  padding: 12px 0;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  background: #003650;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgb(25, 81, 109);
    transform: translateY(-2px);
  }
`;

// Link alternativo
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
      color: rgb(25, 81, 109);
    }
  }
`;

// Link de "Esqueci a senha"
const ForgotPasswordLink = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #003650;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: rgb(25, 81, 109);
  }
`;

export default function Login() {
  // ====== Estados locais ======
  // email e password armazenam os valores dos campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook do Next.js para navegação programática
  const router = useRouter();

  // ====== Função para login ======
  // Disparada ao submeter o formulário
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Previna comportamento padrão do formulário

    try {
      // Chama Firebase para autenticar usuário
      await signInWithEmailAndPassword(auth, email, password);

      // Redireciona para dashboard se login for bem-sucedido
      router.push("/dashboard");
    } catch (error: any) {
      // Mostra alerta em caso de erro de login
      alert(`Erro ao logar: ${error.message}`);
    }
  };

  // ====== Função para redefinição de senha ======
  const handleForgotPassword = async () => {
    // Verifica se o usuário digitou email
    if (!email) {
      alert("Digite seu e-mail para receber o link de redefinição de senha.");
      return;
    }

    try {
      // Envia email de redefinição de senha via Firebase
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    } catch (error: any) {
      // Mostra alerta em caso de erro
      alert(`Erro: ${error.message}`);
    }
  };

  // ====== JSX do componente ======
  return (
    <Container>
      <LoginBox>
        {/* Título do formulário */}
        <Title>Login</Title>

        {/* Formulário de login */}
        <form onSubmit={handleLogin}>
          {/* Input de email */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Input de senha */}
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Botão de submit */}
          <Button type="submit">Entrar</Button>
        </form>

        {/* Link para redefinição de senha */}
        <ForgotPasswordLink onClick={handleForgotPassword}>
          Esqueci minha senha
        </ForgotPasswordLink>

        {/* Link alternativo para registro */}
        <AltText>
          Não tem conta? <Link href="/registro">Registrar</Link>
        </AltText>
      </LoginBox>
    </Container>
  );
}


