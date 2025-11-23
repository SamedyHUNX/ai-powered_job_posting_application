"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        {/* Spinning circle */}
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>

        {/* Pulsing inner circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
      </div>

      {/* Message */}
      {/* {message && (
        <p className="mt-6 text-foreground/70 text-sm font-medium animate-pulse">
          {message}
        </p>
      )} */}
    </div>
  );
}
