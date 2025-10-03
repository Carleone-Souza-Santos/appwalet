// src/components/MonthCard.tsx
import React, { useState } from "react";
import styled from "styled-components";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaMoneyBillWave,
  FaUniversity,
  FaShoppingCart,
  FaCreditCard,
} from "react-icons/fa";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

// ======= ESTILOS =======
const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  min-width: 100px;

  @media (max-width: 1200px) {
    min-width: 75px;
  }

  @media (max-width: 992px) {
    min-width: 70px;
  }

  @media (max-width: 768px) {
    min-width: 50px;
  }

  @media (max-width: 480px) {
    min-width: 40px;
    font-size: 0.55rem;
    gap: 1px;
  }

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 0.65rem;
  position: relative;

  &:hover button {
    opacity: 1;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  border: none;
  background: none;
  cursor: pointer;
  color: #f44336;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 0.7rem;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* espaço entre grupos */
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* espaço entre os cards do mesmo grupo */
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  font-weight: bold;
  font-size: 0.7rem;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DateText = styled.span`
  font-size: 0.4rem;
  color: black;
  text-align: right;
`;

const Container = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (max-width: 1200px) {
    width: 220px;
  }

  @media (max-width: 992px) {
    width: 180px;
  }

  @media (max-width: 768px) {
    width: 140px;
  }

  @media (max-width: 480px) {
    width: 100px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 6px;
  font-size: 0.8rem;

`;

const ArrowButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.85rem;
  color: #3e667a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;

  &:hover {
    color: #000;
  }
`;

const SectionTitle = styled.div`
  font-size: 0.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
  
`;

const Footer = styled.div`
  margin-top: 5px;
  text-align: center;
  font-size: 0.5rem;
  color: #555;
`;

// ======= TIPOS =======
export interface MonthCardProps {
  id: string;
  descricao: string;
  valor: number;
  tipo: "ganho" | "gasto" | "parcelado" | "deposito";
  data: Date;
}

interface TransactionsSidebarProps {
  transacoes: MonthCardProps[];
  onDeleteTransaction: (id: string) => void;
  mesAtual: number;
  setMesAtual: (mes: number) => void;
  anoAtual: number;
  setAnoAtual: (ano: number) => void;
}

// ======= COMPONENTE DE CARD =======
export const TransactionCard: React.FC<
  MonthCardProps & { onDelete?: () => void }
> = ({ descricao, valor = 0, tipo, data, onDelete }) => {
  if (valor === 0) return null;

  const renderIcon = () => {
    switch (tipo) {
      case "ganho":
        return <FaMoneyBillWave color="#4CAF50" />;
      case "deposito":
        return <FaUniversity color="#3F51B5" />;
      case "gasto":
        return <FaShoppingCart color="#F44336" />;
      case "parcelado":
        return <FaCreditCard color="#FFA500" />;
      default:
        return null;
    }
  };

  const formattedDate = new Date(data).toLocaleDateString("pt-BR");

  return (
    <Card>
      <CloseButton onClick={onDelete}>
        <FaTimes />
      </CloseButton>
      <CardContent>
        <Description>
          <strong>{descricao}</strong>
          <DateText>{formattedDate}</DateText>
        </Description>
        <Value>
          {renderIcon()} R$ {valor.toFixed(2)}
        </Value>
      </CardContent>
    </Card>
  );
};

// ======= SIDEBAR =======
export const TransactionsSidebar: React.FC<TransactionsSidebarProps> = ({
  transacoes,
  onDeleteTransaction,
  mesAtual,
  setMesAtual,
  anoAtual,
  setAnoAtual,
}) => {
  const [modalId, setModalId] = useState<string | null>(null);
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const transacoesFiltradas = transacoes.filter(
    (t) =>
      t.data &&
      t.data.getMonth() === mesAtual &&
      t.data.getFullYear() === anoAtual
  );

  const groupedTransacoes = {
    ganho: transacoesFiltradas.filter((t) => t.tipo === "ganho"),
    gasto: transacoesFiltradas.filter((t) => t.tipo === "gasto"),
    parcelado: transacoesFiltradas.filter((t) => t.tipo === "parcelado"),
    deposito: transacoesFiltradas.filter((t) => t.tipo === "deposito"),
  };

  const handlePrevMonth = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const handleNextMonth = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
      setAnoAtual(anoAtual);
    }
  };

  return (
    <Container>
      <Header>
        <ArrowButton onClick={handlePrevMonth}>
          <FaChevronLeft />
        </ArrowButton>
        <span>
          {meses[mesAtual]} / {anoAtual}
        </span>
        <ArrowButton onClick={handleNextMonth}>
          <FaChevronRight />
        </ArrowButton>
      </Header>

      <CardsContainer>
        {Object.entries(groupedTransacoes).map(([tipo, items]) =>
          items.length > 0 ? (
            <GroupContainer key={tipo}>
              <SectionTitle>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </SectionTitle>
              {items.map((t) => (
                <TransactionCard
                  key={t.id}
                  {...t}
                  onDelete={() => setModalId(t.id)}
                />
              ))}
            </GroupContainer>
          ) : null
        )}
      </CardsContainer>

      <Footer>
        {transacoesFiltradas.length} movimento(s) em {meses[mesAtual]} /{" "}
        {anoAtual}
      </Footer>

      {modalId && (
        <ConfirmDeleteModal
          onCancel={() => setModalId(null)}
          onConfirm={() => {
            onDeleteTransaction(modalId);
            setModalId(null);
          }}
        />
      )}
    </Container>
  );
};
