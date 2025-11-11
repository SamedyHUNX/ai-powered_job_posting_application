import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";

import { ReactNode, useEffect } from "react";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, router]);

  return <>{isAuthenticated && children}</>;
}
