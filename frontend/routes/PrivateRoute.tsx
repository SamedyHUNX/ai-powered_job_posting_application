import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/signin");
    }
  }, [isAuthenticated, router]);

  return <>{isAuthenticated && children}</>;
}
