"use client";

import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../customs/theme-toggle";
import { LanguageSwitcher } from "../customs/language-switcher";

export function AppSidebarClient({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-2 h-[68px]">
          <SidebarTrigger />
          <span className="text-xl text-nowrap">JobXHub</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex-1 flex">{children}</div>
      </div>
    );
  }

  return children;
}
