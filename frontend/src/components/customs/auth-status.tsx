import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";

function CustomSignedIn({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

function CustomSignedOut({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return <>{children}</>;
}

export const SignedOut = ({ children }: { children: ReactNode }) => {
  return <CustomSignedOut>{children}</CustomSignedOut>;
};

export const SignedIn = ({ children }: { children: ReactNode }) => {
  return <CustomSignedIn>{children}</CustomSignedIn>;
};
