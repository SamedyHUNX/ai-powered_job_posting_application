import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type CustomButtonProps = {
  className?: string;
  variant?:
    | "link"
    | "ghost"
    | "default"
    | "outline"
    | "secondary"
    | "destructive";
  buttonText?: string;
};

export const BackHomeButton = ({
  className,
  variant,
  buttonText,
}: CustomButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      className={`${className} w-full`}
      onClick={() => {
        router.push("/");
      }}
    >
      {buttonText ? buttonText : "Nevermind"}
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
