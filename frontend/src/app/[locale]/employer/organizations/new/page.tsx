"use client";

import { useOrganization } from "@/hooks/use-organization";
import { createOrganizationSchema } from "@/schemas/organizations/createOrganizationSchema";
import { useErrorHandler } from "@/utils/errorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function CreateOrganizationForm() {
  const t = useTranslations("employer.organizations.newPage");
  const validationT = useTranslations("validations");
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { getErrorMessage } = useErrorHandler();

  const { createOrganization, isCreating, createError, createSuccess } =
    useOrganization();

  const createOrganizationFormSchema = useMemo(
    () => createOrganizationSchema(validationT),
    [validationT]
  );

  const form = useForm<z.infer<typeof createOrganizationFormSchema>>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
      orgName: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (createError) {
      const errorMessage = getErrorMessage(createError);
      toast.error(errorMessage);
    }
  }, [createError, getErrorMessage]);

  // Redirect to employer dashboard on success
  useEffect(() => {
    if (createSuccess) {
      toast.success(t("success"));
      router.push("/employer");
    }
  }, [createSuccess, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    return values.orgName && values.image;
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.image) {
      toast.error("Please upload a photo");
      return;
    }

    const formData = new FormData();
    formData.append("orgName", data.orgName);
    formData.append("image", data.image);

    createOrganization(formData);
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-0">
      <div className="bg-white rounded-3xl w-full max-w-3xl p-12">
        <h1 className="text-4xl font-bold mb-12 text-black">{t("title")}</h1>

        <div>
          {/* Logo Upload Section */}
          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-medium mb-4">
              {t("logoLabel")} <span className="text-red-500">*</span>
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
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <div>
                <label className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors inline-block">
                  {t("upload")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
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
              {...form.register("orgName")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700"
              placeholder={t("namePlaceholder")}
            />
            {form.formState.errors.orgName && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.orgName.message}
              </p>
            )}
          </div>

          {/* Error Display - FIXED */}
          {createError && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{getErrorMessage(createError)}</p>
            </div>
          )}

          {/* Success Display */}
          {createSuccess && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">
                Organization created successfully!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-12">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating}
              className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "..." : t("buttonText")}
            </button>
          </div>
        </div>

        {/* JobXHub Branding */}
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
