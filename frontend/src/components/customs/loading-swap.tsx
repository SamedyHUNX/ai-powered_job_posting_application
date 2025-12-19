import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

export function LoadingSwap({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1",
          isLoading ? "hidden" : "block",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-1 row-start-1 row-end-1",
          isLoading ? "block" : "hidden",
          className
        )}
      >
        <Loader2Icon className="animate-spin" />
      </div>
    </div>
  );
}
