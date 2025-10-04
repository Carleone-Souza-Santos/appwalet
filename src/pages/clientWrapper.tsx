"use client";

import React from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import CircularLoader from "@/components/CircularLoader";
import Header from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: Props) {
  return (
    <AuthProvider>
      <InnerClientWrapper>{children}</InnerClientWrapper>
    </AuthProvider>
  );
}

// Esse componente interno só depende do contexto, então é client component
function InnerClientWrapper({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <CircularLoader />;

  return (
    <>
      <Header />
      {children}
    </>
  );
}