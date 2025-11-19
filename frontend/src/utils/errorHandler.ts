import { useTranslations } from "next-intl";

export function useErrorHandler() {
  const t = useTranslations();

  const getErrorMessage = (error: any) => {
    const errorCode =
      error.response?.data?.code || error.code || "UNKNOWN_ERROR";

    return t(`apiErrors.${errorCode}`, {
      defaultValue: error.message || t(`apiErrors.UNKNOWN_ERROR`),
    });
  };

  return { getErrorMessage };
}
