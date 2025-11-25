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
  const { currentUser, isFetchingCurrentUser, currentUserError } = useProfile();

  // Handle loading state
  if (isFetchingCurrentUser) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle error state
  if (currentUserError) {
    return <div className="text-center">Error loading profile</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!currentUser) {
    return null;
  }

  return (
    <SidebarUserButtonClient
      email={currentUser.email}
      username={currentUser.username}
      imageUrl={currentUser.imageUrl}
    />
  );
}
