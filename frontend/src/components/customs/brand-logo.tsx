"use client";

import Image from "next/image";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import jobXHub from "@/assets/jobxhub.svg";
import { useTheme } from "next-themes";

export interface BrandLogoType {
  logoWidth?: number;
  logoHeight?: number;
  imageWidth?: number;
  imageHeight?: number;
}

export function BrandLogo({
  logoWidth = 48,
  logoHeight = 48,
  imageWidth = 120,
  imageHeight = 40,
}: BrandLogoType) {
  const { theme } = useTheme();
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 flex-shrink-0 mt-1">
        <Image
          src={jobXHub}
          width={logoWidth}
          height={logoHeight}
          alt="JobXHub logo"
          className="dark:invert"
        />
      </div>
      <Image
        src={theme === "dark" ? logoLight : logoDark}
        width={imageWidth}
        height={imageHeight}
        alt="JobXHub"
      />
    </div>
  );
}
