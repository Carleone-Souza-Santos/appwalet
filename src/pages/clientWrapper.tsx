"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import CircularLoader from "@/components/CircularLoader";
import Header from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <CircularLoader />;

  return (
    <>
      <Header />
      {children}
    </>
  );
}
