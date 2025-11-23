import { SignedIn as CustomSignedIn } from "@/services/auth/components/SignedIn";
import { SignedOut as CustomSignedOut } from "@/services/auth/components/SignedOut";
import { ReactNode, Suspense } from "react";

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
