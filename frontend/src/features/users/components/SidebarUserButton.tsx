import { Suspense } from "react";
import { useProfile } from "@/hooks/use-profile";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

function SidebarUserSuspense() {
  const { user, isLoading, error } = useProfile();

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading profile</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!user) {
    return null;
  }

  return (
    <SidebarUserButtonClient
      email={user.email}
      name={user.name}
      imageUrl={user.imageUrl}
    />
  );
}
