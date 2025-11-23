import { useTranslations } from "next-intl";

export function useSuccessHandler() {
  const t = useTranslations();

  const getSuccessMessage = (message: string) => {
    return t(`apiSuccess.${message}`, {
      defaultValue: message || t(`apiSuccess.UNKNOWN_SUCCESS`),
    });
  };

  return { getSuccessMessage };
}
