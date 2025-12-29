"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { useErrorHandler } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/customs/loading-swap";

export default function ForgotPasswordPage() {
  // Translations
  const t = useTranslations();
  const forgotPasswordT = (key: string) => t(`forgotPassword.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);

  const locale = useLocale();
  const {
    forgotPassword,
    isRequestingForgotPassword,
    forgotPasswordError,
    forgotPasswordSuccess,
  } = useAuth();
  const { getErrorMessage } = useErrorHandler();

  const forgotPasswordFormSchema = useMemo(
    () => forgotPasswordSchema(validationT),
    [validationT]
  );

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (forgotPasswordError) {
      toast.error(getErrorMessage(forgotPasswordError));
    } else if (forgotPasswordSuccess) {
      toast.success(successT("forgotPasswordSuccess"));
    }
  }, [forgotPasswordError, getErrorMessage, forgotPasswordSuccess]);

  const onSubmit = async ({ email }: { email: string }) => {
    forgotPassword({ email, locale });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {forgotPasswordT("title")}
        </h2>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {forgotPasswordT("titleDesc")}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                    {forgotPasswordT("emailLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={forgotPasswordT("emailPlaceholder")}
                      className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-11"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {forgotPasswordT("rememberPassword")}{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {forgotPasswordT("signIn")}
                </Link>
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isRequestingForgotPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LoadingSwap isLoading={isRequestingForgotPassword}>
              {forgotPasswordT("buttonText")}
            </LoadingSwap>
          </Button>
        </form>
      </Form>
    </div>
  );
}
