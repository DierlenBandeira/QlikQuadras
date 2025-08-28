"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function LogoutMenuItem() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
    router.refresh();     // atualiza header/estado
    router.push("/");     // manda pra home (ajuste se quiser)
  }

  // Radix usa onSelect no item de menu
  return (
    <DropdownMenuItem
      onSelect={handleLogout}
      className="cursor-pointer text-red-600 focus:text-red-700"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
