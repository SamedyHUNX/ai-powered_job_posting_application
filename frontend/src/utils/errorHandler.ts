import { useTranslations } from "next-intl";

export function useErrorHandler() {
  const t = useTranslations();

  const getErrorMessage = (error: any, namespace: string = "common") => {
    const errorCode =
      error.response?.data?.code || error.code || "UNKNOWN_ERROR";

    console.log(errorCode);

    return t(`${namespace}.apiErrors.${errorCode}`, {
      defaultValue: error.message || t(`${namespace}.apiErrors.UNKNOWN_ERROR`),
    });
  };

  return { getErrorMessage };
}
