"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function LogoutMenuItem() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("signOut error", error);
      setBusy(false);
      return;
    }
    // Hard refresh garante que TUDO recarrega com estado deslogado
    window.location.href = "/"; // pode usar router.refresh()+router.push("/") também, mas aqui é à prova de bala
  };

  return (
    <DropdownMenuItem asChild>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full text-left cursor-pointer text-red-600 focus:text-red-700 flex items-center"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>{busy ? "Saindo..." : "Sair"}</span>
      </button>
    </DropdownMenuItem>
  );
}
