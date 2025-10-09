// src/types/Transacao.ts

// ==============================
// 📄 Interface Transacao
// ==============================
// Define o formato (tipagem) de uma transação financeira usada em toda a aplicação.
// Essa interface garante consistência nos dados armazenados e manipulados no Firestore.
export interface Transacao {
  id?: string;           // 🔹 ID opcional (gerado automaticamente pelo Firestore)
  userId: string;        // 🔹 ID do usuário dono da transação (usado para filtrar dados)
  descricao: string;     // 🔹 Descrição breve da transação (ex: "Salário", "Supermercado")
  valor: number;         // 🔹 Valor monetário da transação
  tipo: 'ganho' | 'gasto'; // 🔹 Tipo da transação: pode ser "ganho" (entrada) ou "gasto" (saída)
  data: any;             // 🔹 Data da transação — pode ser um objeto Date, Timestamp ou string
}