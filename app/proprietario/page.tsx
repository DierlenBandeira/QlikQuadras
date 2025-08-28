import OwnerHero from "@/components/owner/OwnerHero";
import StatsGrid from "@/components/owner/StatsGrid";
import PendingApprovals from "@/components/owner/PendingApprovals";
import ReservationsTable from "@/components/owner/ReservationsTable";

import { mockReservations } from "@/lib/mock/reservations";
import { mockPendingApprovals } from "@/lib/mock/pending-approvals";

export default function ProprietarioPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <OwnerHero />
      <StatsGrid reservations={mockReservations} approvals={mockPendingApprovals} />
      
        <div className="space-y-6">
        <section>
            <PendingApprovals initial={mockPendingApprovals} />
        </section>

        <section className="pt-2 border-t border-gray-100">
            <ReservationsTable items={mockReservations} />
        </section>
        </div>


    </div>
  );
}
