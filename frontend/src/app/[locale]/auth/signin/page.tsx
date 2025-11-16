"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
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
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import PublicRoute from "@/routes/PublicRoute";
import Link from "next/link";
import { useErrorHandler } from "@/utils/errorHandler";
import { createSignInSchema, SignInFormData } from "@/schemas/signInSchema";

export default function SigninPage() {
  const t = useTranslations("signIn");
  const { signIn, isSigningIn, signInError } = useAuth();
  const { getErrorMessage } = useErrorHandler();

  const signInFormSchema = useMemo(() => createSignInSchema(t), [t]);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (signInError) {
      const errorMessage = getErrorMessage(signInError);
      toast.error(errorMessage);
    }
  }, [signInError, getErrorMessage]);

  const onSubmit = (data: SignInFormData) => {
    signIn(data);
  };

  return (
    <PublicRoute>
      <div className="mx-auto max-w-lg space-y-8">
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
                        className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

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
                        className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
            >
              {isSigningIn ? t("loadingText") : t("buttonText")}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                {t("dontHaveAnAccount")}{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {t("signUp")}
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </PublicRoute>
  );
}
