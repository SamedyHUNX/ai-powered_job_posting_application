"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import PublicRoute from "../../../../../routes/PublicRoute";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useErrorHandler } from "../../../../../utils/errorHandler";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.any().refine((file) => file instanceof File, "Image is required"),
});

type SignUpFormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const t = useTranslations("signUp");
  const { signUp, isSigningUp, signUpError } = useAuth();
  const { getErrorMessage } = useErrorHandler();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (signUpError) {
      const errorMessage = getErrorMessage(signUpError, "signUp");
      toast.error(errorMessage);
    }
  }, [signUpError, getErrorMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: SignUpFormData) => {
    if (!data.image) {
      toast.error("Please upload a profile photo");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("image", data.image);

    signUp(formData);
  };

  return (
    <PublicRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-gray-400">{t("titleDesc")}</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5 rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800">
              {/* Photo Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      {t("profile")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-4">
                        {preview && (
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <label className="w-full cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">
                              {preview ? t("changePhoto") : t("uploadPhoto")}
                            </span>
                          </div>
                          <Input
                            {...field}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      {t("username")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("username")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      {t("firstName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("firstName")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      {t("lastName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t("lastName")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      {t("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">
                      {t("passwordLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Sign In Link */}
              <div className="pt-2">
                <p className="text-sm text-gray-400">
                  {t("alreadyHaveAnAccount")}{" "}
                  <Link
                    href="/auth/signin"
                    className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {t("signIn")}
                  </Link>
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSigningUp}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 font-medium py-2.5 shadow-lg hover:shadow-xl transition-all"
            >
              {isSigningUp ? t("buttonLoading") : t("signUp")}
            </Button>
          </form>
        </Form>
      </div>
    </PublicRoute>
  );
}
