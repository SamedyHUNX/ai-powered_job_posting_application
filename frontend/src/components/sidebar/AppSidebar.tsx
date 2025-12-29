import Link from "next/link";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { NavBar } from "../customs/Navbar";

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
  const isMobile = useIsMobile();

  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row h-[68px]">
            <SidebarTrigger className="mt-1" />
            <Link className="mt-2" href={"/"}>
              JobXHub
            </Link>
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
