"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignedOut } from "@/services/auth/components/SignedOut";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar
      content={
        <SidebarGroup>
          <SidebarMenu>
            <SignedOut>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/auth/signin"}>
                    <LogInIcon />
                    <span>Sign In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SignedOut>
          </SidebarMenu>
        </SidebarGroup>
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
