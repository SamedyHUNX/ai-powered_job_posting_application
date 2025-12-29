"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";
import { routing } from "@/i18n/routing";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "kh", name: "ខ្មែរ", flag: "🇰🇭" },
  { code: "de", name: "Deutsch", flag: "🇨🇭" },
];

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Normalize the locale
  const normalizedLocale = locale.toLowerCase().split("-")[0];

  // Get the current language display info
  const currentLanguage =
    languages.find((lang) => lang.code === normalizedLocale) || languages[0];

  // Function to switch language
  const switchLanguage = (newLocale: string) => {
    let pathWithoutLocale = pathname;

    // Remove all locale prefixes
    let changed = true;
    while (changed) {
      changed = false;
      for (const loc of routing.locales) {
        const prefix = `/${loc}`;
        if (
          pathWithoutLocale === prefix ||
          pathWithoutLocale.startsWith(`${prefix}/`)
        ) {
          pathWithoutLocale = pathWithoutLocale.replace(prefix, "") || "/";
          changed = true;
          break;
        }
      }
    }

    if (!pathWithoutLocale.startsWith("/")) {
      pathWithoutLocale = `/${pathWithoutLocale}`;
    }

    // Preserve query parameters
    const queryString = searchParams.toString();
    const newPath = `/${newLocale}${pathWithoutLocale}${
      queryString ? `?${queryString}` : ""
    }`;

    // Navigate to the new locale path
    router.push(newPath);
    // Force a refresh to ensure the layout re-renders with new locale
    // router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-10">
          {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-none">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onSelect={() => switchLanguage(language.code)}
            className={`cursor-pointer ${
              normalizedLocale === language.code ? "bg-accent" : ""
            }`}
          >
            {language.flag} {language.name}
            {normalizedLocale === language.code && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
