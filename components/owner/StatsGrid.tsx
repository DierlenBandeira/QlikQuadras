"use client";

import { type Reservation, type PendingApproval } from "@/types/owner";
import { CalendarCheck, Clock, HandCoins, Building2 } from "lucide-react";

// mapeia pt-BR <-> inglês para garantir consistência
function normalizeStatus(s: string): "pending" | "confirmed" | "canceled" {
  const map: Record<string, "pending" | "confirmed" | "canceled"> = {
    pending: "pending",
    pendente: "pending",
    confirmed: "confirmed",
    confirmada: "confirmed",
    canceled: "canceled",
    cancelada: "canceled",
  };
  return map[s] ?? "pending";
}

function StatCard({
  title,
  value,
  subtitle,
  Icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {subtitle && (
        <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
      )}
    </div>
  );
}

export default function StatsGrid({
  reservations,
  approvals,
  quadrasAtivas,
}: {
  reservations: Reservation[];
  approvals: PendingApproval[];
  quadrasAtivas: number;
}) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // Confirmadas (independe de approvals)
  const confirmadas = reservations.filter(
    (r) => normalizeStatus((r as any).status) === "confirmed"
  ).length;

  // Pendentes (união por id: evita dupla contagem)
  const pendingFromReservations = reservations
    .filter((r) => normalizeStatus((r as any).status) === "pending")
    .map((r) => r.id);

  const pendingFromApprovals = approvals.map((a) => a.id);

  const pendingIds = new Set<string>([
    ...pendingFromReservations,
    ...pendingFromApprovals,
  ]);

  const pendentes = pendingIds.size;

  // Faturamento do mês: soma apenas confirmadas no mês/ano atual
  const faturamentoMes = reservations
    .filter((r) => {
      if (normalizeStatus((r as any).status) !== "confirmed") return false;
      const d = new Date(r.data); // ideal: ISO completa (ex.: 2025-08-31T18:00:00Z)
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, r) => sum + (r.valor ?? 0), 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Reservas confirmadas"
        value={String(confirmadas)}
        subtitle="no total"
        Icon={CalendarCheck}
      />
      <StatCard
        title="Pendentes"
        value={String(pendentes)}
        subtitle="aprovação/confirm."
        Icon={Clock}
      />
      <StatCard
        title="Faturamento (mês)"
        value={faturamentoMes.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        subtitle={now.toLocaleDateString("pt-BR", { month: "long" })}
        Icon={HandCoins}
      />
      <StatCard
        title="Quadras ativas"
        value={String(quadrasAtivas)}
        Icon={Building2}
      />
    </div>
  );
}
