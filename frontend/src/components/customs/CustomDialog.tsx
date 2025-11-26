import Link from "next/link";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface CustomDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  description?: string;
  href?: string;
  additionalDesc?: string[];
  additionalDescTitle?: string;
  cancelButtonText?: string;
  buttonText?: string;
}

export const CustomDialog = ({
  title,
  open,
  onOpenChange,
  onCancel,
  description,
  additionalDesc,
  additionalDescTitle,
  cancelButtonText = "Nevermind",
  href,
  buttonText,
}: CustomDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50 mb-4">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {additionalDescTitle}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
            {additionalDesc &&
              additionalDesc.map((desc, index) => <li key={index}>{desc}</li>)}
          </ul>
        </div>
        <DialogFooter>
          {onCancel && (
            <Button variant="destructive" onClick={onCancel}>
              {cancelButtonText}
            </Button>
          )}
          {href && (
            <Button asChild>
              <Link href={href}>{buttonText ? buttonText : "Create"}</Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
