"use client";

import Link from "next/link";
import { BrandLogo, BrandLogoType } from "./brand-logo";

export function BrandHeader({
  title,
  titleDesc,
  className,
  ...brandLogoProps
}: BrandLogoType & {
  title?: string;
  titleDesc?: string;
  className?: string;
}) {
  return (
    <Link href="/" className={className}>
      <BrandLogo {...brandLogoProps} />
      {(title || titleDesc) && (
        <div className="flex flex-col mb-2">
          {" "}
          {title && (
            <h2 className="text-3xl tracking-tighter text-gray-900 dark:text-white">
              {" "}
              {title}{" "}
            </h2>
          )}{" "}
          {titleDesc && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {" "}
              {titleDesc}{" "}
            </p>
          )}{" "}
        </div>
      )}
    </Link>
  );
}
