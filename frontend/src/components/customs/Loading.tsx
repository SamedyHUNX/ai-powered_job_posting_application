"use client";

const translations: Record<string, string> = {
  en: "Loading",
  de: "Lädt...",
  kh: "កំពុងដំណើរការ...",
};

export function Loading({ locale = "en" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        {/* Spinning circle */}
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
      {locale && (
        <p className="mt-4 text-muted-foreground">{translations[locale]}</p>
      )}
    </div>
  );
}
