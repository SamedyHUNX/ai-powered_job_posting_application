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

function SidebarUserSuspense() {
  const { profile, isLoading, error } = useProfile();

  console.log(profile);

  return (
    <SidebarUserButtonClient
      email="samedy@gmail.com"
      name="samedy"
      imageUrl=""
    />
  );
}
