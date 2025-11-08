import { useAuth } from "@/hooks/use-auth";
import { ReactNode, Suspense } from "react";

interface SignedOutProps {
  children: ReactNode;
}

export function SignedOut({ children }: SignedOutProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return <Suspense>{children}</Suspense>;
}
