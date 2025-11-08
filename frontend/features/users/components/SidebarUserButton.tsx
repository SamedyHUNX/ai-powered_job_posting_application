import { useProfile } from "@/hooks/use-profile";
import { Suspense } from "react";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const { profile, isLoading, error } = useProfile();

  return (
    <SidebarUserButtonClient
      email="samedy@gmail.com"
      name="samedy"
      imageUrl=""
    />
  );
}
