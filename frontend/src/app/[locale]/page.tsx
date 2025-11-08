"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { AppSidebarClient } from "./_AppSidebarClient";
import PrivateRoute from "../../../routes/PrivateRoute";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { SignedOut } from "../../../services/auth/components/SignedOut";
import { SidebarUserButton } from "../../../features/users/components/SidebarUserButton";
import { SignedIn } from "../../../services/auth/components/SignedIn";

export default function HomePage() {
  const t = useTranslations("homePage");

  return (
    <PrivateRoute>
      <SidebarProvider className="overflow-y-hidden">
        <AppSidebarClient>
          <Sidebar collapsible="icon" className="overflow-hidden">
            <SidebarHeader className="flex-row">
              <SidebarTrigger />
              <span className="mt-1">SamedyX</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
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
              </SidebarGroup>
            </SidebarContent>
            <SignedIn>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarUserButton />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </SignedIn>
          </Sidebar>
          <main className="flex-1">Homepage</main>
        </AppSidebarClient>
      </SidebarProvider>
    </PrivateRoute>
  );
}
