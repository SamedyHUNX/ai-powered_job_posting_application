import Link from "next/link";
import { SignedIn } from "../customs/SignInStatus";
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
import { ReactNode } from "react";

export const AppSidebar = ({
  content,
  children,
  footerButton,
}: {
  content?: ReactNode;
  children: ReactNode;
  footerButton: ReactNode;
}) => {
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
        <main className="flex-1 w-full">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};
