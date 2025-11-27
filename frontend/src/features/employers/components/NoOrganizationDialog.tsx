"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { CustomDialog } from "@/components/customs/CustomDialog";
import { useRouter } from "next/navigation";

interface NoOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export function NoOrganizationDialog({
  open,
  onOpenChange,
  onCancel,
}: NoOrganizationDialogProps) {
  const customDialT = useTranslations("employer.customDialog");
  const router = useRouter();

  const benefits = useMemo(
    () =>
      ["one", "two", "three", "four"].map((key) =>
        customDialT(`benefits.${key}`)
      ),
    [customDialT]
  );

  return (
    <CustomDialog
      title={customDialT("title")}
      description={customDialT("description")}
      open={open}
      onOpenChange={onOpenChange}
      onCancel={onCancel}
      additionalDescTitle="An organization allows you to:"
      additionalDesc={benefits}
      buttonText={customDialT("createButton")}
      cancelButtonText={customDialT("cancelButton")}
      href={"/employer/organizations/new"}
    />
  );
}
