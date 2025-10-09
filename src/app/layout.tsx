import "../styles/globals.css";
import ClientWrapper from "@/pages/clientWrapper";

export const metadata = {
  title: "Wallet App",
  description: "Sistema Financeiro Pessoal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}