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
import PrivateRoute from "@/routes/PrivateRoute";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SignedIn } from "@/services/auth/components/SignedIn";
import { Greeting } from "@/components/customs/Greeting";
import { SignedOut } from "@/components/customs/SignInStatus";
import { useProfile } from "@/hooks/use-profile";
import Loading from "@/components/customs/Loading";

export default function HomePage() {
  const t = useTranslations("homePage");
  const { user, isLoading, error } = useProfile();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <PrivateRoute>
      <SidebarProvider className="overflow-y-hidden">
        <AppSidebarClient>
          <Sidebar collapsible="icon" className="overflow-hidden">
            <SidebarHeader className="flex-row">
              <SidebarTrigger />
              <span className="mt-1">JobXHub</span>
            </SidebarHeader>
            <SidebarContent>
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
          <main className="flex-1">
            <Greeting userName="Samedyhun" />
          </main>
        </AppSidebarClient>
      </SidebarProvider>
    </PrivateRoute>
  );
}
