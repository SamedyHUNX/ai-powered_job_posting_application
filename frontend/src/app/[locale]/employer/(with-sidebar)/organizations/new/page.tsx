"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useErrorHandler } from "@/utils/errorHandler";
import { useOrganization } from "@/hooks/use-organization";
import { createOrganizationSchema } from "@/schemas/organizations/createOrganizationSchema";

export default function CreateOrganizationForm() {
  // Translations
  const t = useTranslations();
  const newOrgT = (key: string) => t(`employer.organizations.newPage.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);

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
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      orgName: "",
      slug: "",
      image: undefined,
    },
  });

  // Error toast state management
  useEffect(() => {
    if (createError) {
      const errorMessage = getErrorMessage(createError);
      toast.error(errorMessage);
    }
  }, [createError, getErrorMessage]);

  // Redirect to employer dashboard on success
  useEffect(() => {
    if (createSuccess) {
      toast.success(successT("createNewOrgSuccess"));
      // Redirect to the organization select page
      router.push("/employer/organizations/select");
    }
  }, [createSuccess, router, t]);

  // Auto-generate slug from organization name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

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

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.image) {
      toast.error(validationT("photoRequired"));
      return;
    }

    const formData = new FormData();
    formData.append("orgName", data.orgName);
    formData.append("slug", data.slug);
    formData.append("image", data.image);

    createOrganization(formData);
  });

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#fdfbf7] dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full p-12 border-1 border-gray-300">
        <h1 className="text-4xl font-bold mb-12 text-black tracking-tighter">
          {newOrgT("title")}
        </h1>

        <Form {...form}>
          <form onSubmit={handleSubmit}>
            {/* Logo Upload Section */}
            <FormField
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    {newOrgT("logoLabel")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <label
                        className={`w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 ${fieldState.error
                          ? "border-red-500"
                          : "border-gray-300"
                          }`}
                      >
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
                          {newOrgT("upload")}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                        <FormDescription className="mt-2">
                          {newOrgT("uploadDesc")}
                        </FormDescription>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Name Input */}
            <FormField
              control={form.control}
              name="orgName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    {newOrgT("nameLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={newOrgT("namePlaceholder")}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Capitalize first letter of each word
                        const capitalized = value
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        field.onChange(capitalized);

                        // Auto-generate slug from normalized value
                        const slug = generateSlug(capitalized);
                        form.setValue("slug", slug);
                      }}
                      className={`text-gray-700 ${fieldState.error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                        }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug Input */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    {newOrgT("slug")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="my-organization"
                      {...field}
                      className={`text-gray-700 font-mono ${fieldState.error ? "border-red-500" : ""
                        }`}
                    />
                  </FormControl>
                  <FormDescription>{newOrgT("slugDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Display */}
            {createError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{getErrorMessage(createError)}</p>
              </div>
            )}

            {/* Success Display */}
            {createSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">
                  {successT("createNewOrgSuccess")}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                {isCreating ? "..." : newOrgT("buttonText")}
              </Button>
            </div>
          </form>
        </Form>

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
