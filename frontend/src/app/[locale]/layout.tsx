import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SWRConfig } from "swr";
import { Providers } from "@/providers/providers";
import "./globals.css";
import "@mdxeditor/editor/style.css";
import { LocaleType } from "@/types";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as LocaleType)) notFound();

  // Load messages for this locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            dedupingInterval: 5000,
          }}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute={"class"}
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Providers>
                <Toaster richColors theme="light" />
                {children}
              </Providers>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
