"use client";

import { type Reservation } from "@/types/owner";
import { type PendingApproval } from "@/types/owner";
import { CalendarCheck, Clock, HandCoins, Building2 } from "lucide-react";

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
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
}

export default function StatsGrid({
  reservations,
  approvals,
}: {
  reservations: Reservation[];
  approvals: PendingApproval[];
}) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const confirmed = reservations.filter((r) => r.status === "confirmada").length;
  const pendentes =
    approvals.length + reservations.filter((r) => r.status === "pendente").length;

  const faturamentoMes = reservations
    .filter((r) => {
      const d = new Date(r.data);
      return r.status === "confirmada" && d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, r) => sum + (r.valor ?? 0), 0);

  const quadrasAtivas = new Set(reservations.map((r) => r.quadra)).size || 1;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Reservas confirmadas"
        value={String(confirmed)}
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
        value={faturamentoMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        subtitle={now.toLocaleDateString("pt-BR", { month: "long" })}
        Icon={HandCoins}
      />
      <StatCard title="Quadras ativas" value={String(quadrasAtivas)} Icon={Building2} />
    </div>
  );
}
