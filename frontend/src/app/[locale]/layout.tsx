import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.css";
import { Providers } from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) notFound();

  // Load messages for this locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className="dark">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Toaster richColors theme="light" />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
