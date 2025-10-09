"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext"; // Importa o contexto de autenticação e o hook de acesso
import CircularLoader from "@/components/CircularLoader";       // Componente de carregamento (spinner)
import Header from "@/components/Header";                       // Componente do cabeçalho da aplicação

// ==============================
// 🧩 Tipagem das propriedades
// ==============================
// Define que o componente receberá elementos filhos (children)
// — ou seja, o conteúdo interno que será renderizado dentro do wrapper.
interface Props {
  children: React.ReactNode;
}

// ==============================
// 🌐 ClientWrapper
// ==============================
// Este componente é o ponto de entrada principal da camada de cliente ("use client").
// Ele envolve toda a aplicação com o `AuthProvider`, garantindo que
// o estado de autenticação esteja acessível a todos os componentes filhos.
export default function ClientWrapper({ children }: Props) {
  return (
    // O `AuthProvider` disponibiliza o contexto de autenticação para toda a árvore de componentes.
    <AuthProvider>
      {/* O conteúdo interno é delegado ao `InnerClientWrapper`, 
          que decide o que exibir com base no estado de autenticação */}
      <InnerClientWrapper>{children}</InnerClientWrapper>
    </AuthProvider>
  );
}

// ==============================
// 🔐 InnerClientWrapper
// ==============================
// Este componente é responsável por controlar a renderização condicional
// com base no estado de autenticação do usuário.
function InnerClientWrapper({ children }: Props) {
  // Obtém o estado atual de autenticação através do contexto
  const { user, loading } = useAuth();

  // Enquanto o Firebase verifica o status do usuário (login automático, token, etc.),
  // exibe o componente de carregamento circular para evitar piscar telas indevidas.
  if (loading) return <CircularLoader />;

  // Quando o estado de autenticação termina de carregar:
  // - Exibe o cabeçalho fixo no topo da página
  // - Renderiza o conteúdo principal da aplicação (children)
  return (
    <>
      <Header /> {/* Cabeçalho global visível em todas as páginas autenticadas */}
      {children} {/* Conteúdo principal renderizado após autenticação */}
    </>
  );
}
