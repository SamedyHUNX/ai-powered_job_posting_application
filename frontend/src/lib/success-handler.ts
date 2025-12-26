import { AuthResponse } from "@/types";
import { useTranslations } from "next-intl";

export function useSuccessHandler() {
  const t = useTranslations();

  const getSuccessMessage = (response: AuthResponse) => {
    const successCode = response.code || 0;

    return t(`apiSuccess.${successCode}`, {
      defaultValue: response.code || t(`apiSuccess.0`),
    });
  };

  return { getSuccessMessage };
}
