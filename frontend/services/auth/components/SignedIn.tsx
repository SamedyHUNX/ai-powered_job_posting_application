import { useAuth } from "@/hooks/use-auth";
import { ReactNode, Suspense } from "react";

interface SignedInProps {
  children: ReactNode;
}

export function SignedIn({ children }: SignedInProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <Suspense>{children}</Suspense>;
}
