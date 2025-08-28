"use client";

import { useState } from "react";
import type { PendingApproval } from "@/types/owner";
import { Check, X, Mail, Phone, IdCard } from "lucide-react";

export default function PendingApprovals({ initial }: { initial: PendingApproval[] }) {
  const [items, setItems] = useState<PendingApproval[]>(initial);

  const approve = (id: string) => {
    if (!confirm("Aprovar esta solicitação?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const reject = (id: string) => {
    if (!confirm("Rejeitar esta solicitação?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="font-semibold">Aprovações pendentes</h3>
          <p className="text-sm text-muted-foreground">
            Solicitações aguardando aprovação
          </p>
        </div>
        <span className="rounded-full bg-amber-100 text-amber-700 text-xs px-3 py-1">
          {items.length} pendentes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Quadra</th>
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Horário</th>
              <th className="px-5 py-3">Pagamento</th>
              <th className="px-5 py-3">Solicitado em</th>
              <th className="px-5 py-3 text-right">Valor</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50/60">
                <td className="px-5 py-3">
                  <div className="font-medium">{r.cliente}</div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{r.email}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{r.telefone}</span>
                    <span className="inline-flex items-center gap-1"><IdCard className="h-3.5 w-3.5" />{r.cpf}</span>
                  </div>
                </td>
                <td className="px-5 py-3">{r.quadra}</td>
                <td className="px-5 py-3">{new Date(r.data).toLocaleDateString("pt-BR")}</td>
                <td className="px-5 py-3">{r.horario}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">
                    {r.metodoPagamento}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {new Date(r.dataSolicitacao).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-5 py-3 text-right">
                  {r.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => approve(r.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-green-700 hover:bg-green-100 transition"
                    >
                      <Check className="h-4 w-4" /> Aprovar
                    </button>
                    <button
                      onClick={() => reject(r.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100 transition"
                    >
                      <X className="h-4 w-4" /> Rejeitar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma aprovação pendente no momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
