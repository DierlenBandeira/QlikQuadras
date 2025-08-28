"use client";
import type { Reservation } from "@/types/owner";

export default function ReservationsTable({ items }: { items: Reservation[] }) {
  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="font-semibold">Últimas reservas</h3>
          <p className="text-sm text-muted-foreground">Histórico recente</p>
        </div>
        <a
          href="/proprietario/reservas"
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition"
        >
          Ver todas
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Quadra</th>
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Horário</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50/60">
                <td className="px-5 py-3">
                  <div className="font-medium">{r.cliente}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </td>
                <td className="px-5 py-3">{r.quadra}</td>
                <td className="px-5 py-3">{new Date(r.data).toLocaleDateString("pt-BR")}</td>
                <td className="px-5 py-3">{r.horario}</td>
                <td className="px-5 py-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                      r.status === "confirmada"
                        ? "bg-green-100 text-green-700"
                        : r.status === "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700",
                    ].join(" ")}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {r.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  Nenhuma reserva por aqui ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
