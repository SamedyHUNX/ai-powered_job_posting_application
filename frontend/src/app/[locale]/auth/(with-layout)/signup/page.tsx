"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useMemo, useState } from "react";
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
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useErrorHandler } from "@/lib/error-handler";
import { createSignUpSchema, SignUpFormData } from "@/schemas/signUpSchema";
import { LoadingSwap } from "@/components/customs/loading-swap";

export default function SignUpPage() {
  const locale = useLocale();

  // Translations
  const t = useTranslations();
  const signUpT = (key: string) => t(`signUp.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);

  const { signUp, isSigningUp, signUpError, signUpSuccess } = useAuth();
  const { getErrorMessage } = useErrorHandler();
  const [preview, setPreview] = useState<string | null>(null);

  const signUpFormSchema = useMemo(
    () => createSignUpSchema(validationT),
    [validationT]
  );

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (signUpError) {
      toast.error(getErrorMessage(signUpError));
    }
  }, [signUpError, getErrorMessage]);

  useEffect(() => {
    if (signUpSuccess) {
      toast.success(successT("signUpSuccess"));
    }
  }, [signUpSuccess, signUpT]);

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
      toast.error(validationT("photoRequired"));
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("image", data.image);

    signUp({ formData, locale });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {signUpT("title")}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {signUpT("titleDesc")}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5 rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
            {/* Photo Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({
                field: { onChange, value, ...field },
                fieldState,
              }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signUpT("profile")}
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
                        <div
                          className={`flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors ${
                            fieldState.error
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                        >
                          <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {preview
                              ? signUpT("changePhoto")
                              : signUpT("uploadPhoto")}
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
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signUpT("username")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={signUpT("username")}
                      className={`bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
                        fieldState.error
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signUpT("firstName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={signUpT("firstName")}
                      className={`bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
                        fieldState.error
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signUpT("lastName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder={signUpT("lastName")}
                      className={`bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
                        fieldState.error
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signUpT("emailLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={signUpT("emailPlaceholder")}
                      className={`bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
                        fieldState.error
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signUpT("passwordLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={signUpT("passwordPlaceholder")}
                      className={`bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
                        fieldState.error
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Sign In Link */}
            <div className="pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {signUpT("alreadyHaveAnAccount")}{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                >
                  {signUpT("signIn")}
                </Link>
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSigningUp}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-800 font-medium py-2.5 shadow-lg hover:shadow-xl transition-all"
          >
            <LoadingSwap isLoading={isSigningUp}>
              {signUpT("signUp")}
            </LoadingSwap>
          </Button>
        </form>
      </Form>
    </div>
  );
}
