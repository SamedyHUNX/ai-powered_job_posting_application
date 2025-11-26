import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackHomeButton = () => {
  const router = useRouter();
  return (
    <Button
      className="w-full"
      onClick={() => {
        router.push("/");
      }}
    >
      Back Home
    </Button>
  );
};

export const SignOutButton = () => {
  const { logout } = useAuth();
  return (
    <Button className="w-full" onClick={() => logout()}>
      <LogOutIcon className="mr-1" /> Sign Out
    </Button>
  );
};
