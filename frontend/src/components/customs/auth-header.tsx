"use client";

import { BrandLogo } from "./brand-logo";

export function AuthHeader({
  title,
  titleDesc,
}: {
  title: string;
  titleDesc: string;
}) {
  return (
    <>
      <BrandLogo />
      <div className="flex flex-col">
        <h2 className="text-3xl tracking-tighter text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {titleDesc}
        </p>
      </div>
    </>
  );
}
