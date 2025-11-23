import { useAuth } from "@/hooks/use-auth";
import { ReactNode, Suspense } from "react";

export function SignedIn({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <Suspense>{children}</Suspense>;
}
