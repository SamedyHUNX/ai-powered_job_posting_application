import axios, { AxiosError } from "axios";
import { useTranslations } from "next-intl";

interface ApiError {
  code?: number;
  message?: string;
}

export function useErrorHandler() {
  const t = useTranslations();

  const getErrorMessage = (error: unknown) => {
    let apiError: ApiError = { code: 9999 };

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.code) {
        apiError.code = error.response.data.code;
        apiError.message = error.response.data.message;
      }
    }

    return t(`apiErrors.${apiError.code}`);
  };

  return { getErrorMessage };
}
