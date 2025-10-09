"use client";

import React, { useState } from "react";
import styled from "styled-components";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaMoneyBillWave,
  FaShoppingCart,
  FaCreditCard,
  FaUniversity,
  FaEdit,
  FaBolt,
  FaWater,
  FaFire,
  FaWifi,
  FaHome,
  FaBuilding,
  FaCar,
  FaMotorcycle,
  FaFilm,
  FaLaptop,
  FaHospital,
  FaTools,
  FaDog,
  FaWrench,
  FaGasPump,
  FaBus,
  FaBook,
  FaLaptopCode,
  FaUtensils,
  FaCoffee,
  FaPrescriptionBottle,
  FaFileInvoiceDollar,
  FaFileInvoice,
  FaUser,
  FaHamburger,
  FaExclamationTriangle,
  FaPlayCircle,
  FaTshirt,
  FaGem,
  FaShoePrints,
  FaSpa,
  FaUmbrellaBeach,
  FaPlane,
  FaGift,
  FaStore,
  FaUber,
  FaDumbbell,
  FaTrash,
} from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { EditTransactionInput } from "@/components/EditTransactionInput";
import { db } from "../firebase/config";
import { doc, deleteDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import MediaDiaria from "./MediaDiaria";
import MediaDiariaGasto from "./MediaDiariaGasto";
import { useAuth } from "@/contexts/AuthContext";
import { default as styledImport } from "styled-components";


// ==================== ESTILOS ====================
const Card = styledImport.div.withConfig({
  shouldForwardProp: (prop) => prop !== "valorZero" && prop !== "open",
}) <{ open?: boolean; valorZero?: boolean }>`
  background-color: #fff;
  border-radius: 10px;
  padding: ${({ open }) => (open ? "12px 14px" : "8px 14px")};
  min-width: 120px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: ${({ open }) => (open ? "6px" : "2px")};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${({ valorZero }) => (valorZero ? 0.5 : 1)};
  &:hover button {
    opacity: 1;
  }
`;


const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  max-width: 400px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
  }
`;




const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const Value = styled.div`
  font-weight: bold;
`;

const DateText = styled.span`
  font-size: 0.7rem;
  color: #333;
`;

const Container = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1rem;
`;

const ArrowButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #3e667a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  &:hover {
    color: #000;
  }
`;

const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
`;

const Footer = styled.div`
  margin-top: 6px;
  text-align: center;
  font-size: 0.6rem;
  color: #555;
`;

const ActionButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.8;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    opacity: 1;
    color: #007bff;
  }
`;

const EditSquare = styled(ActionButton)`
  width: 28px;
  height: 28px;
  background: #f0f0f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  &:hover {
    background: #e0e0e0;
  }
`;
// Contêiner para as médias
const DivCont = styled.div`
  margin-top:100px;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  width: 100%; 
  padding: 0 10px; 
`;


const DeleteButtonTop = styled(ActionButton)`
  position: absolute;
  top: 6px;
  right: 6px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    color: #f44336;
  }
`;

// ==================== TIPOS ====================
export interface MonthCardProps {
  id: string;
  descricao: string;
  valor: number;
  tipo: "ganho" | "gasto" | "parcelado" | "deposito";
  data: Date;
  iconeSelecionado?: string;
  parcela?: string;
}

interface TransactionsSidebarProps {
  transacoes: MonthCardProps[];
  setTransacoes: React.Dispatch<React.SetStateAction<MonthCardProps[]>>;
  onEditTransaction?: (id: string, novoValor: number) => void;
  mesAtual: number;
  setMesAtual: React.Dispatch<React.SetStateAction<number>>;
  anoAtual: number;
  setAnoAtual: React.Dispatch<React.SetStateAction<number>>;
}

interface User {
  uid: string;
  displayName?: string;
  email?: string;
}

// ==================== CARD ====================
export const TransactionCard: React.FC<
  MonthCardProps & {
    onDelete?: (id: string) => void;
    onEdit?: (id: string, novoValor: number) => void;
    onDuplicate?: (id: string) => void;
  }
> = ({ id, descricao, valor, tipo, data, parcela, onDelete, onEdit, onDuplicate, iconeSelecionado }) => {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);

  const iconMap: Record<string, JSX.Element> = {
    Freelance: <FaLaptop color="#4CAF50" />,
    Premiacao: <FaUniversity color="#4CAF50" />,
    Salario: <FaMoneyBillWave color="#4CAF50" />,
    Servicos: <FaCreditCard color="#4CAF50" />,
    Vendas: <FaShoppingCart color="#4CAF50" />,

    // 
    Academia: <FaDumbbell color="#F44336" />,
    Agua: <FaWater color="#F44336" />,
    Aluguel: <FaHome color="#F44336" />,
    Cafe: <FaCoffee color="#F44336" />,
    Calcados: <FaShoePrints color="#F44336" />,
    Cinema: <FaFilm color="#F44336" />,
    Combustivel: <FaGasPump color="#F44336" />,
    Conserto: <FaWrench color="#F44336" />,
    Condominio: <FaBuilding color="#F44336" />,
    CompraMes: <FaShoppingCart color="#F44336" />,
    Corem: <FaFileInvoiceDollar color="#F44336" />,
    CorteCabelo: <FaScissors color="#F44336" />,
    Creditos: <FaCreditCard color="#F44336" />,
    Cursos: <FaLaptopCode color="#F44336" />,
    Energia: <FaBolt color="#F44336" />,
    Escola: <FaBook color="#F44336" />,
    Farmacia: <FaPrescriptionBottle color="#F44336" />,
    Feira: <FaStore color="#F44336" />,
    FinanciamentoCarro: <FaCar color="#F44336" />,
    FinanciamentoCasa: <FaBuilding color="#F44336" />,
    FinanciamentoMoto: <FaMotorcycle color="#F44336" />,
    Funcionario: <FaUser color="#F44336" />,
    Gas: <FaFire color="#F44336" />,
    Internet: <FaWifi color="#F44336" />,
    IPVA: <FaFileInvoiceDollar color="#F44336" />,
    IPTU: <FaFileInvoice color="#F44336" />,
    Joias: <FaGem color="#F44336" />,
    Lanches: <FaHamburger color="#F44336" />,
    Lixo: <FaTrash color="#F44336" />,
    Multa: <FaExclamationTriangle color="#F44336" />,
    Oficina: <FaTools color="#F44336" />,
    Padaria: <FaShoppingCart color="#F44336" />,
    PlanoSaude: <FaHospital color="#F44336" />,
    Praia: <FaUmbrellaBeach color="#F44336" />,
    Presente: <FaGift color="#F44336" />,
    RacaoPet: <FaDog color="#F44336" />,
    Restaurante: <FaUtensils color="#F44336" />,
    Roupas: <FaTshirt color="#F44336" />,
    SalaoBeleza: <FaSpa color="#F44336" />,
    Streamers: <FaPlayCircle color="#F44336" />,
    Transporte: <FaBus color="#F44336" />,
    Uber: <FaUber color="#F44336" />,
    Viagem: <FaPlane color="#F44336" />,
    deposito: <FaUniversity color="#8000FF" />,
    parcelado: <FaCreditCard color="#FFC107" />,
  };

  const renderIcon = () => iconMap[iconeSelecionado || tipo] || null;
  const formattedDate = new Date(data).toLocaleDateString("pt-BR");

  return (
    <Card open={open} valorZero={valor === 2} onClick={() => setOpen(!open)}>
      <CardHeader>
        {renderIcon()}
        <strong>{descricao}</strong>
        {tipo === "parcelado" && parcela && (
          <span style={{ fontSize: "0.6rem", color: "#888", marginLeft: "4px" }}>({parcela})</span>
        )}




      </CardHeader>
      {open && (
        <CardContent>
          <Value>R$ {valor.toFixed(2)}</Value>
          <DateText>{formattedDate}</DateText>
          <div style={{ display: "flex", gap: "4px" }}>
            {onEdit &&
              (editing ? (
                <EditTransactionInput
                  initialValue={valor}
                  onConfirm={(novoValor) => {
                    onEdit(id, novoValor);
                    setEditing(false);
                  }}
                  onCancel={() => setEditing(false)}
                />
              ) : (
                <EditSquare
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(true);
                  }}
                >
                  <FaEdit />
                </EditSquare>
              ))}
            {onDelete && (
              <DeleteButtonTop
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
                <FaTimes />
              </DeleteButtonTop>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};



// ==================== SIDEBAR ====================
export const TransactionsSidebar: React.FC<TransactionsSidebarProps> = ({
  transacoes,
  setTransacoes,
  onEditTransaction,
  mesAtual,
  setMesAtual,
  anoAtual,
  setAnoAtual,
}) => {
  const [modalId, setModalId] = useState<string | null>(null);
  const { currentUser } = useAuth() as { currentUser: User | null };

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const transacoesFiltradas = transacoes.filter(
    (t) => t.data instanceof Date && t.data.getMonth() === mesAtual && t.data.getFullYear() === anoAtual
  );

  const groupedTransacoes = {
    ganho: transacoesFiltradas.filter((t) => t.tipo === "ganho"),
    gasto: transacoesFiltradas.filter((t) => t.tipo === "gasto"),
    parcelado: transacoesFiltradas.filter((t) => t.tipo === "parcelado"),
    deposito: transacoesFiltradas.filter((t) => t.tipo === "deposito"),
  };

  const handleDeleteAllMonths = async (id: string) => {
    try {
      const docRef = doc(db, "transacoes", id);
      await deleteDoc(docRef);
      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
    }
  };

  const handleDuplicateNextMonth = async (id: string) => {
    try {
      if (!currentUser) {
        alert("Usuário não autenticado! Faça login para duplicar.");
        return;
      }

      const item = transacoes.find((t) => t.id === id);
      if (!item) return;

      const confirmar = window.confirm("Tem certeza que deseja duplicar esta transação para o próximo mês?");
      if (!confirmar) return;

      const novaData = new Date(item.data);
      novaData.setMonth(novaData.getMonth() + 1);

      const novoDoc = {
        descricao: item.descricao,
        valor: item.valor,
        tipo: item.tipo,
        data: Timestamp.fromDate(novaData),
        iconeSelecionado: item.iconeSelecionado || "",
        parcela: item.parcela || "",
        userId: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, "transacoes"), novoDoc);
      setTransacoes((prev) => [...prev, { ...novoDoc, id: docRef.id, data: novaData }]);

      // ALERTA SONORO E VISUAL
      const notificationSound = new Audio("/sound/quick-ting.mp3");
      notificationSound.play();
      alert("Transação duplicada com sucesso!");
    } catch (error) {
      console.error("Erro ao duplicar:", error);
      alert("Erro ao duplicar a transação.");
    }
  };

  return (
    <Container>
      <Header>
        <ArrowButton
          onClick={() => {
            const novoMes = mesAtual - 1;
            if (novoMes < 0) {
              setMesAtual(11);
              setAnoAtual(anoAtual - 1);
            } else setMesAtual(novoMes);
          }}
        >
          <FaChevronLeft />
        </ArrowButton>

        <span>
          {meses[mesAtual]} / {anoAtual}
        </span>

        <ArrowButton
          onClick={() => {
            const novoMes = mesAtual + 1;
            if (novoMes > 11) {
              setMesAtual(0);
              setAnoAtual(anoAtual + 1);
            } else setMesAtual(novoMes);
          }}
        >
          <FaChevronRight />
        </ArrowButton>
      </Header>

      <CardsContainer>
        {Object.entries(groupedTransacoes).map(
          ([tipo, items]) =>
            items.length > 0 && (
              <GroupContainer key={tipo}>
                <SectionTitle>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</SectionTitle>
                {[...items]
                  .sort((a, b) => b.valor - a.valor)
                  .map((t) => (
                    <TransactionCard
                      key={t.id}
                      {...t}
                      onDelete={(id) => setModalId(id)}
                      onEdit={(id, novoValor) => {
                        onEditTransaction && onEditTransaction(id, novoValor);
                        // ALERTA SONORO E VISUAL AO EDITAR
                        const notificationSound = new Audio("/sound/quick-ting.mp3");
                        notificationSound.play();
                        alert("Transação alterada com sucesso!");
                      }}
                      onDuplicate={handleDuplicateNextMonth}
                    />
                  ))}
              </GroupContainer>
            )
        )}
      </CardsContainer>

      <Footer>
        {transacoesFiltradas.length} movimento(s) em {meses[mesAtual]} / {anoAtual}
        <DivCont>
          <MediaDiaria mesAtual={mesAtual} anoAtual={anoAtual} />
          <MediaDiariaGasto mesAtual={mesAtual} anoAtual={anoAtual} />
        </DivCont>
      </Footer>

      {modalId && (
        <ConfirmDeleteModal
          onCancel={() => setModalId(null)}
          onConfirm={() => {
            handleDeleteAllMonths(modalId);
            setModalId(null);
          }}
        />
      )}
    </Container>
  );
};

