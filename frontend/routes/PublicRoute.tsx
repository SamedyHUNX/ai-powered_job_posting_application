import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return <>{!isAuthenticated && children}</>;
}
