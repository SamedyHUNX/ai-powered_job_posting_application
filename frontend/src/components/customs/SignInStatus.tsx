import { useAuth } from "@/hooks/use-auth";
import { ReactNode, Suspense } from "react";

function CustomSignedIn({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return <Suspense>{children}</Suspense>;
}

function CustomSignedOut({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return <Suspense>{children}</Suspense>;
}

export const SignedOut = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <CustomSignedOut>{children}</CustomSignedOut>
    </Suspense>
  );
};

export const SignedIn = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <CustomSignedIn>{children}</CustomSignedIn>
    </Suspense>
  );
};
