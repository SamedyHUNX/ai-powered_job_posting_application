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

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading profile</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!profile) {
    return null;
  }

  // Now profile is guaranteed to exist
  return (
    <SidebarUserButtonClient
      email={profile.email}
      name={profile.name}
      imageUrl={profile.imageUrl}
    />
  );
}
