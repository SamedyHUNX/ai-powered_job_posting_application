"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { Eye, EyeOff } from "lucide-react";
import { useErrorHandler } from "@/lib/error-handler";
import { LoadingSwap } from "@/components/customs/loading-swap";
import { createResetPasswordSchema, ResetPasswordFormData } from "@/schemas";
import { AuthHeader } from "@/components/customs/auth-header";

export default function ResetPasswordPage() {
  // Translations
  const t = useTranslations();
  const resetPasswordT = (key: string) => t(`resetPassword.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { getErrorMessage } = useErrorHandler();

  const {
    resetPassword,
    isResettingPassword,
    resetPasswordError,
    resetPasswordSuccess,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordFormSchema = useMemo(
    () => createResetPasswordSchema(validationT),
    [validationT]
  );

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (resetPasswordError) {
      toast.error(getErrorMessage(resetPasswordError));
    } else if (resetPasswordSuccess) {
      toast.success(successT("resetPasswordSuccess"));
    }
  }, [resetPasswordError, getErrorMessage, resetPasswordSuccess]);

  if (!token) {
    return null;
  }

  const onSubmit = ({
    newPassword,
    confirmPassword,
  }: ResetPasswordFormData) => {
    resetPassword({
      token,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto mt-[10%] min-h-screen">
      {/* Header */}
      <AuthHeader
        title={resetPasswordT("title")}
        titleDesc={resetPasswordT("titleDesc")}
      />

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                    {resetPasswordT("newPasswordLabel")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={resetPasswordT("newPasswordPlaceholder")}
                        className={`w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10 ${
                          fieldState.error
                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                    {resetPasswordT("confirmPasswordLabel")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={resetPasswordT(
                          "confirmPasswordPlaceholder"
                        )}
                        className={`w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10 ${
                          fieldState.error
                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isResettingPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LoadingSwap isLoading={isResettingPassword}>
              {resetPasswordT("buttonText")}
            </LoadingSwap>
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {resetPasswordT("rememberPassword")}{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              {resetPasswordT("signIn")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
