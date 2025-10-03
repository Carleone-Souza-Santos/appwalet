// src/types/Transacao.ts
export interface Transacao {
  id?: string;
  userId: string;
  descricao: string;
  valor: number;
  tipo: 'ganho' | 'gasto';
  data: any; // Timestamp do Firebase
}
