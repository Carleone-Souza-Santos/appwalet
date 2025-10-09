"use client";

import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import {
  FaMoneyBillWave, FaShoppingCart, FaCreditCard, FaUniversity, FaLaptop, FaFileAlt, FaWater,
  FaFire, FaCar, FaHome, FaBolt, FaBuilding, FaWifi, FaHospital, FaFilm, FaTimes, FaMotorcycle,
  FaTools, FaDog, FaWrench, FaGasPump, FaBus, FaBook, FaLaptopCode, FaUtensils, FaCoffee,
  FaPrescriptionBottle, FaFileInvoiceDollar, FaFileInvoice, FaUser, FaHamburger, FaExclamationTriangle,
  FaShoppingBasket,
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
  FaTrash
} from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";
import IconSelectModal from "@/components/IconSelectModal";

// ==============================
// ANIMAÇÕES
// ==============================
const blink = keyframes`
  0%,50%,100%{opacity:1;transform:translateX(0);}
  25%,75%{opacity:0;transform:translateX(-5px);}
`;

const shine = keyframes`
  0%{background-position:-200px 0;}
  100%{background-position:200px 0;}
`;

// ==============================
// ESTILOS DOS COMPONENTES
// ==============================
const IconButton = styled.button`
  background: linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgb(23,59,77) 100%);
  border: none;
  color: white;
  border-radius: 50%;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }
`;
const FormContainer = styled.form<{ minimized?: boolean }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
  align-items: center;
  background-color: #f9f9f9;
  padding: ${({ minimized }) => minimized ? "4px" : "10px"};
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  width: ${({ minimized }) => minimized ? "50px" : "100%"};
  height: ${({ minimized }) => minimized ? "50px" : "auto"};
  justify-content: ${({ minimized }) => minimized ? "center" : "flex-start"};
`;

const CloseButton = styled.button`
  position:absolute;
  top:-10px;
  right:-10px;
  background:#fff;
  border:none;
  border-radius:50%;
  width:25px;
  height:25px;
  cursor:pointer;
  display:flex;
  justify-content:center;
  align-items:center;
  box-shadow:0 2px 6px rgba(0,0,0,0.2);
  transition:0.2s;
  &:hover{background:rgba(240,240,240,0.57);}
 
`;

const MinimizedWrapper = styled.div`
  position:fixed;
  top:20px;
  right:150px;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:6px;
  cursor:pointer;
  z-index:10001;
`;

const MirrorButton = styled.div`
  width:50px;
  height:50px;
  border-radius:50%;
  background:linear-gradient(145deg,rgba(255,255,255,0.25)0%,rgba(61,102,121,1)100%);
  display:flex;
  align-items:center;
  justify-content:center;
  color:white;
  animation:${shine} 4s infinite linear;
`;

const InputContainer = styled.div`
  position:relative;
  display:flex;
  align-items:center;
  min-width:180px;
  margin-right:10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px 28px 6px 8px; 
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem; 
  &:focus {
    outline: none;
    border-color: #628292;
    box-shadow: 0 0 3px rgba(40, 33, 133, 0.4);
  }
`;

const InputIcon = styled.div`
  position:absolute;
  right:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  pointer-events:none;
  font-size:1.2rem;
`;

const ValorInput = styled(Input)`
  width: 100px; 
  text-align: right;
`;

const Button = styled.button<{ tipo?: string; disabled?: boolean }>`
  margin-left:500px;
  padding: 10px 100px;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ tipo, disabled }) =>
    disabled
      ? "rgba(200,200,200,0.5)"
      : tipo === "gasto" ? "#F44336" :
        tipo === "parcelado" ? "#FFB300" :
          tipo === "deposito" ? "#3F51B5" : "#4CAF50"};
  transition: 0.3s;
  &:hover { opacity: ${({ disabled }) => (disabled ? 0.7 : 1)}; }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 5px;
`;

// ==============================
// DADOS ESTÁTICOS
// ==============================
const tipos = [
  { value: "deposito", label: "Depósito", icon: <FaUniversity /> },
  { value: "ganho", label: "Ganho", icon: <FaMoneyBillWave /> },
  { value: "gasto", label: "Gasto", icon: <FaShoppingCart /> },
  { value: "parcelado", label: "Parcelado", icon: <FaCreditCard /> },
];

const ganhos = [
  { value: "Freelance", label: "Freelance", icon: <FaLaptop /> },
  { value: "Premiacao", label: "Premiação", icon: <FaUniversity /> },
  { value: "Salario", label: "Salário", icon: <FaMoneyBillWave /> },
  { value: "Servicos", label: "Serviços", icon: <FaCreditCard /> },
  { value: "Vendas", label: "Vendas", icon: <FaShoppingCart /> },
];

export const gastos = [
  { value: "Academia", label: "Academia", icon: <FaDumbbell /> },
  { value: "Agua", label: "Água", icon: <FaWater /> },
  { value: "Aluguel", label: "Aluguel", icon: <FaHome /> },
  { value: "Cafe", label: "Café", icon: <FaCoffee /> },
  { value: "Calcados", label: "Calçados", icon: <FaShoePrints /> },
  { value: "Cinema", label: "Cinema", icon: <FaFilm /> },
  { value: "Combustivel", label: "Combustível", icon: <FaGasPump /> },
  { value: "Conserto", label: "Conserto", icon: <FaWrench /> },
  { value: "Condominio", label: "Condomínio", icon: <FaBuilding /> },
  { value: "CompraMes", label: "Compra Mês", icon: <FaShoppingCart /> },
  { value: "Corem", label: "Corem", icon: <FaFileInvoiceDollar /> },
  { value: "CorteCabelo", label: "Corte de Cabelo", icon: <FaScissors /> },
  { value: "Creditos", label: "Créditos", icon: <FaCreditCard /> },
  { value: "Cursos", label: "Cursos", icon: <FaLaptopCode /> },
  { value: "Energia", label: "Energia", icon: <FaBolt /> },
  { value: "Escola", label: "Escola", icon: <FaBook /> },
  { value: "Farmacia", label: "Farmácia", icon: <FaPrescriptionBottle /> },
  { value: "FinanciamentoCarro", label: "Financiamento Carro", icon: <FaCar /> },
  { value: "FinanciamentoCasa", label: "Financiamento Casa", icon: <FaBuilding /> },
  { value: "FinanciamentoMoto", label: "Financiamento Moto", icon: <FaMotorcycle /> },
  { value: "Funcionario", label: "Funcionário", icon: <FaUser /> },
  { value: "Gas", label: "Gás", icon: <FaFire /> },
  { value: "IPTU", label: "IPTU", icon: <FaFileInvoice /> },
  { value: "IPVA", label: "IPVA", icon: <FaFileInvoiceDollar /> },
  { value: "Internet", label: "Internet", icon: <FaWifi /> },
  { value: "Lanches", label: "Lanches", icon: <FaHamburger /> },
  { value: "Lixo", label: "Lixo", icon: <FaTrash /> },
  { value: "Multa", label: "Multa", icon: <FaExclamationTriangle /> },
  { value: "Oficina", label: "Oficina", icon: <FaTools /> },
  { value: "Padaria", label: "Padaria", icon: <FaShoppingBasket /> },
  { value: "PlanoSaude", label: "Plano de Saúde", icon: <FaHospital /> },
  { value: "RacaoPet", label: "Ração Pet", icon: <FaDog /> },
  { value: "Restaurante", label: "Restaurante", icon: <FaUtensils /> },
  { value: "Transporte", label: "Transporte", icon: <FaBus /> },
  { value: "Feira", label: "Feira", icon: <FaStore /> },
  { value: "Uber", label: "Uber", icon: <FaUber /> },
  { value: "Streamers", label: "Streamers", icon: <FaPlayCircle /> },
  { value: "Roupas", label: "Roupas", icon: <FaTshirt /> },
  { value: "Joias", label: "Joias", icon: <FaGem /> },
  { value: "SalaoBeleza", label: "Salão de Beleza", icon: <FaSpa /> },
  { value: "Praia", label: "Praia", icon: <FaUmbrellaBeach /> },
  { value: "Viagem", label: "Viagem", icon: <FaPlane /> },
  { value: "Presente", label: "Presente", icon: <FaGift /> },
];

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
interface Props { refresh: () => void }

const TransacaoForm: React.FC<Props> = ({ refresh }) => {
  const { user } = useAuth();
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [tipo, setTipo] = useState<"" | "ganho" | "gasto" | "parcelado" | "deposito">("");
  const [vezes, setVezes] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<{ value: string, label: string, icon: JSX.Element }[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [minimized, setMinimized] = useState(false);
  const [erro, setErro] = useState("");
  const [refreshMedia, setRefreshMedia] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Abre modal dependendo do tipo selecionado
  useEffect(() => {
    if (tipo === "ganho") { setModalItems(ganhos); setModalOpen(true); }
    else if (tipo === "gasto") { setModalItems(gastos); setModalOpen(true); }
  }, [tipo]);

  // Validação simples do formulário
  const isFormValid =
    (tipo === "parcelado" || tipo === "deposito" ? descricao.trim() !== "" : true) &&
    valor !== "" && Number(valor) > 0 &&
    tipo !== "" && (tipo !== "parcelado" || (vezes && Number(vezes) > 0));

  // Função de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!user || !isFormValid) return;

    try {
      // Toca áudio de confirmação
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.log);
      }

      const hoje = new Date();
      const anoAtual = hoje.getFullYear();

      const criarTransacaoMes = async (
        descricao: string,
        valor: number,
        tipo: string,
        icone: string,
        mes: number,
        parcela?: string
      ) => {
        const dataMes = new Date(anoAtual, mes, 1);
        await addDoc(collection(db, "transacoes"), {
          descricao,
          valor,
          tipo,
          userId: user.uid,
          data: Timestamp.fromDate(dataMes),
          iconeSelecionado: icone,
          parcela: parcela || null,
        });
      };

      // Cria a transação no mês atual
      if (tipo === "parcelado" && vezes > 1) {
        const valorParcela = Number(valor) / vezes;
        for (let m = 0; m < vezes; m++) {
          await criarTransacaoMes(
            descricao,
            valorParcela,
            tipo,
            selectedIcon,
            hoje.getMonth() + m,
            `${m + 1}/${vezes}`
          );
        }
      } else {
        await criarTransacaoMes(descricao, Number(valor), tipo, selectedIcon, hoje.getMonth());
      }

      // DUPLICA GASTOS PARA OS MESES RESTANTES COM VALOR 0
      if (tipo === "gasto") {
        const mesAtual = hoje.getMonth();
        for (let m = mesAtual + 1; m < 12; m++) {
          await criarTransacaoMes(descricao, 0, tipo, selectedIcon, m);
        }
      }

      if (tipo === "ganho") setRefreshMedia(prev => prev + 1);

      setDescricao("");
      setValor("");
      setTipo("");
      setSelectedIcon("");
      setVezes(1);
      refresh();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      setErro("Erro ao adicionar transação.");
    }
  };

  const handleTipoClick = () => {
    setModalItems(tipos);
    setModalOpen(true);
  };

  const handleSelect = (value: string) => {
    if (modalItems === tipos) {
      setTipo(value as any);
      setDescricao("");
      setValor("");
      setSelectedIcon("");
      setVezes(1);
    } else {
      setDescricao(value);
      setSelectedIcon(value);
    }
    setModalOpen(false);
  };

  if (minimized) {
    return (
      <MinimizedWrapper onClick={() => setMinimized(false)}>
        <MirrorButton><FaMoneyBillWave /></MirrorButton> {/* Ícone do botão minimizado */}
      </MinimizedWrapper>
    );
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <CloseButton type="button" onClick={() => setMinimized(true)}>
        <FaTimes size={14} />
      </CloseButton>

      <IconButton onClick={handleTipoClick}>
        {tipo ? (
          React.cloneElement(tipos.find(t => t.value === tipo)?.icon, { style: { width: '20px', height: '20px' } })
        ) : (
          <FaFileAlt style={{ width: '20px', height: '20px' }} />
        )}
      </IconButton>

      {(tipo === "parcelado" || tipo === "deposito" || tipo === "ganho" || tipo === "gasto") && (
        <InputContainer>
          <Input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
          <InputIcon>{selectedIcon && tipos.find(t => t.value === tipo)?.icon}</InputIcon>
        </InputContainer>
      )}

      <InputContainer>
        <ValorInput
          type="text"
          placeholder="R$ 0,00"
          value={valor === "" ? "" : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          onChange={e => {
            const rawValue = e.target.value.replace(/\D/g, "");
            setValor(rawValue ? Number(rawValue) / 100 : "");
          }}
        />
      </InputContainer>

      {tipo === "parcelado" && (
        <Input
          type="number"
          placeholder="Parcelas (1-60)"
          min={1}
          max={60}
          value={vezes}
          onChange={e => setVezes(Number(e.target.value))}
        />
      )}

      <Button tipo={tipo} disabled={!isFormValid} type="submit">Adicionar</Button>

      {erro && <ErrorMessage>{erro}</ErrorMessage>}

      <audio ref={audioRef} src="/sound/quick-ting.mp3" preload="auto" />
      {modalOpen && <IconSelectModal items={modalItems} onSelect={handleSelect} onClose={() => setModalOpen(false)} />}
    </FormContainer>
  );
};

export default TransacaoForm;
