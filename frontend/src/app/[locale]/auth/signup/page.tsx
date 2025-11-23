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
import PublicRoute from "@/routes/PublicRoute";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useErrorHandler } from "@/utils/errorHandler";
import { createSignUpSchema, SignUpFormData } from "@/schemas/signUpSchema";

export default function SignUpPage() {
  const locale = useLocale();
  const signUpT = useTranslations("signUp");
  const validationT = useTranslations("validations");
  const { signUp, isSigningUp, signUpError, signUpSuccess } = useAuth();
  const { getErrorMessage } = useErrorHandler();
  const [preview, setPreview] = useState<string | null>(null);

  const signUpFormSchema = useMemo(
    () => createSignUpSchema(validationT),
    [validationT]
  );

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
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
      const errorMessage = getErrorMessage(signUpError);
      toast.error(errorMessage);
    }
  }, [signUpError, getErrorMessage]);

  useEffect(() => {
    if (signUpSuccess) {
      toast.success(signUpT("success"));
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

    signUp({ formData, locale });
  };

  return (
    <PublicRoute>
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
                render={({ field: { onChange, value, ...field } }) => (
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
                          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      {signUpT("username")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={signUpT("username")}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      {signUpT("firstName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={signUpT("firstName")}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      {signUpT("lastName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={signUpT("lastName")}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      {signUpT("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={signUpT("emailPlaceholder")}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      {signUpT("passwordLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={signUpT("passwordPlaceholder")}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
              {isSigningUp ? signUpT("buttonLoading") : signUpT("signUp")}
            </Button>
          </form>
        </Form>
      </div>
    </PublicRoute>
  );
}
