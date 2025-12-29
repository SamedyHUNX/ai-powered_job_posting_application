import { SignedIn } from "../customs/auth-status";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { AppSidebarClient } from "./_appsidebar-client";
import { ReactNode } from "react";
import { NavBar } from "../customs/navbar";
import { BrandHeader } from "../customs/brand-header";

export const AppSidebar = ({
  content,
  children,
  footerButton,
  showNavBar = true,
}: {
  content?: ReactNode;
  children: ReactNode;
  footerButton: ReactNode;
  showNavBar?: boolean;
}) => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row h-[48px] mt-2">
            <SidebarTrigger className="mt-2" />
            <BrandHeader logoWidth={42} />
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1 w-full">
          {showNavBar && <NavBar />}
          {children}
        </main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};
