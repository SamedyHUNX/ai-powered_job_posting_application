import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogOutIcon } from "lucide-react";

export function SignOutButton() {
  const { logout } = useAuth();

  return (
    <DropdownMenuItem onClick={() => logout()}>
      <LogOutIcon className="mr-1" /> Sign Out
    </DropdownMenuItem>
  );
}
