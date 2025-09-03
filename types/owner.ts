export type ReservationStatus = "confirmada" | "pendente" | "cancelada";
export type PaymentMethod = "PIX" | "Cartão" | "Dinheiro" | "Pagar na Quadra";

export interface Reservation {
  id: string;
  quadra: string;
  cliente: string;
  email: string;
  telefone: string;
  data: string;
  horario: string;
  valor: number;
  status: ReservationStatus;
  metodoPagamento: PaymentMethod;
  comprovantePagamento?: string;
}

export interface PendingApproval {
  id: string;
  quadra: string;
  cliente: string;
  email: string;
  telefone: string;
  cpf: string;
  data: string;
  horario: string;
  valor: number;
  status: "pending";
  metodoPagamento: PaymentMethod;
  dataSolicitacao: string;
}
