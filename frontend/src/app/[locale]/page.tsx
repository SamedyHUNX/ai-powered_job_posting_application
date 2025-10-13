"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { AppSidebarClient } from "./_AppSidebarClient";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span>SamedyX Jobs</span>
          </SidebarHeader>
          <SidebarContent>fhjkskhjfs</SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>jdksjfksjk</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">jfljdjsflks</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
