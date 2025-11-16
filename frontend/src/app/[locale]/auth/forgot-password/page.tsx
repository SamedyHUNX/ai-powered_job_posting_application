"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
import { Button } from "@/components/ui/button";
import PublicRoute from "@/routes/PublicRoute";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaData,
} from "@/schemas/forgotPasswordSchema";
import { useErrorHandler } from "@/utils/errorHandler";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const { forgotPassword, isRequestingForgotPassword, forgotPasswordError } =
    useAuth();
  const { getErrorMessage } = useErrorHandler();

  const forgotPasswordFormSchema = useMemo(() => forgotPasswordSchema(t), [t]);

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (forgotPasswordError) {
      const errorMessage = getErrorMessage(
        forgotPasswordError,
        "forgotPassword"
      );
      toast.error(errorMessage);
    }
  }, [forgotPasswordError, getErrorMessage]);

  const onSubmit = ({ email }: ForgotPasswordSchemaData) => {
    forgotPassword(email);
  };

  if (emailSent) {
    return (
      <PublicRoute>
        <div className="space-y-8">
          {/* Success State */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Check Your Email
            </h2>
            <p className="mt-4 text-base text-gray-400 max-w-md mx-auto">
              We've sent a password reset link to{" "}
              <strong className="text-white">{form.getValues("email")}</strong>.
              Please check your inbox and click the link to reset your password.
            </p>
          </div>

          <div className="rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p className="text-sm text-gray-300">
                  The link will expire in 1 hour for security purposes
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p className="text-sm text-gray-300">
                  Didn't receive the email? Check your spam folder
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p className="text-sm text-gray-300">
                  Click the link in the email to complete your password reset
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 space-y-3">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Didn't receive the email? Resend
              </button>
              <p className="text-sm text-gray-400 text-center">
                Remember your password?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Back to Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }

  return (
    <PublicRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-gray-400 max-w-md mx-auto">
            {t("titleDesc")}
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium">
                      {t("emailLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-11"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="pt-2 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  {t("rememberPassword")}{" "}
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
              disabled={isRequestingForgotPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors shadow-lg shadow-blue-500/20"
            >
              {isRequestingForgotPassword ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("sending")}
                </span>
              ) : (
                t("buttonText")
              )}
            </Button>
          </form>
        </Form>
      </div>
    </PublicRoute>
  );
}
