import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// @ts-expect-error
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as "en" | "th")) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
