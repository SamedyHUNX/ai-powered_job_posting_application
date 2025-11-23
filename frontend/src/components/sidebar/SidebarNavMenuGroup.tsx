import { ReactNode } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { SignedOut } from "@/services/auth/components/SignedOut";
import Link from "next/link";
import { LogInIcon } from "lucide-react";

export function SidebarNavMenuGroup({}: {
  item: {
    href: string;
    icon: ReactNode;
    label: string;
    authStatus: "signedOut" | "signedIn";
  };
  className?: string;
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SignedOut>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/auth/signin"}></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SignedOut>
      </SidebarMenu>
    </SidebarGroup>
  );
}
