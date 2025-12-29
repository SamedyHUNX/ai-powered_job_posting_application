"use client";

import Image from "next/image";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import jobXHub from "@/assets/jobxhub.svg";
import { useTheme } from "next-themes";

export function BrandLogo() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex-shrink-0">
        <Image
          src={jobXHub}
          width={48}
          height={48}
          alt="JobXHub logo"
          className="dark:invert"
        />
      </div>
      <Image
        src={theme === "dark" ? logoLight : logoDark}
        width={120}
        height={40}
        alt="JobXHub"
      />
    </div>
  );
}
