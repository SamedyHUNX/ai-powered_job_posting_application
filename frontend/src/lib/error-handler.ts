import { useTranslations } from "next-intl";

/**
 * Creates an error handling hook that produces user-facing error messages using translations.
 *
 * The returned `getErrorMessage` function maps an error to a translation key `apiErrors.<code>` where
 * `code` is taken from `error.response?.data.code`; if that code is missing the key `apiErrors.UNKNOWN_ERROR`
 * is used. If the translation for the resolved key is not available the function falls back to `error.message`
 * or the `apiErrors.UNKNOWN_ERROR` translation.
 *
 * @returns An object containing:
 * - `getErrorMessage(error)` — returns the resolved translated message string for the provided error.
 */
export function useErrorHandler() {
  const t = useTranslations();

  const getErrorMessage = (error: any) => {
    const errorCode = error.response?.data.code || "UNKNOWN_ERROR";

    return t(`apiErrors.${errorCode}`, {
      defaultValue: error.message || t(`apiErrors.UNKNOWN_ERROR`),
    });
  };

  return { getErrorMessage };
}