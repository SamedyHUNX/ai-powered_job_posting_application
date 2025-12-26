import { useTranslations } from "next-intl";
import { ApiError } from "./api-error";

export function useErrorHandler() {
  const t = useTranslations();

  const getErrorMessage = (error: ApiError) => {
    const errorCode = error.code || 9999;

    return t(`apiErrors.${errorCode}`, {
      defaultValue: error.code || t(`apiErrors.9999`),
    });
  };

  return { getErrorMessage };
}
