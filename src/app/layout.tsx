// src/app/layout.tsx
import "../styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientWrapper from "../pages/clientWrapper";


export const metadata = {
  title: "Wallet App",
  description: "Sistema Financeiro Pessoal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
