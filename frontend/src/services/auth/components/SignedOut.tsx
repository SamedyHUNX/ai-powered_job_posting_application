import { useAuth } from "@/hooks/use-auth";
import { ReactNode, Suspense } from "react";

export function SignedOut({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return <Suspense>{children}</Suspense>;
}
