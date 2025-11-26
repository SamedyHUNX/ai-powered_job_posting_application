"use client";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CreateOrganizationForm() {
  const t = useTranslations("employer.organizations.newPage");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log({ name, slug, logo: logoPreview });
    alert("Organization created!");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-12">
        <h1 className="text-4xl font-bold mb-12 text-black">{t("title")}</h1>

        <div>
          {/* Logo Upload Section */}
          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-medium mb-4">
              {t("logoLabel")}
            </label>
            <div className="flex items-center gap-4">
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-10 h-10 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  placeholder={t("logoPlaceholder")}
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <div>
                <label className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors inline-block">
                  {t("upload")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 mt-2 text-sm">{t("uploadDesc")}</p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-medium mb-4">
              {t("nameLabel")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder={t("namePlaceholder")}
            />
          </div>

          {/* Slug URL Input */}
          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-medium mb-4">
              {t("slugLabel")}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-12">
            <button
              onClick={handleSubmit}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              {t("buttonText")}
            </button>
          </div>
        </div>

        {/* Clerk Branding */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span>Secured by</span>
            <span className="text-gray-900 font-semibold">JobXHub</span>
          </div>
        </div>
      </div>
    </div>
  );
}
