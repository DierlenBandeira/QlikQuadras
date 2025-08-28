import type { PendingApproval } from "@/types/owner";

export const mockPendingApprovals: PendingApproval[] = [
  {
    id: "PA001",
    quadra: "Natu Sport",
    cliente: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    telefone: "(11) 95555-7890",
    cpf: "123.456.789-00",
    data: "2025-09-20",
    horario: "15:00 - 16:00",
    valor: 150,
    metodoPagamento: "Dinheiro",
    dataSolicitacao: "2025-08-27",
  },
  {
    id: "PA002",
    quadra: "Natu Sport",
    cliente: "Fernanda Costa",
    email: "fernanda.costa@email.com",
    telefone: "(11) 94444-5678",
    cpf: "987.654.321-00",
    data: "2025-09-25",
    horario: "10:00 - 11:00",
    valor: 150,
    metodoPagamento: "Dinheiro",
    dataSolicitacao: "2025-08-27",
  },
];
