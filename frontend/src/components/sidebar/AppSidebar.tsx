import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { AppSidebarClient } from "./_AppSidebarClient";
import { SignedIn } from "@/services/auth/components/SignedIn";
import { ReactNode } from "react";

export const AppSidebar = ({
  content,
  children,
  footerButton,
}: {
  content: ReactNode;
  children: ReactNode;
  footerButton: ReactNode;
}) => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="mt-1">JobXHub</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>{content}</SidebarGroup>
          </SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};
