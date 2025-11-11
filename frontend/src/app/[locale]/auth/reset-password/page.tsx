"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import PublicRoute from "../../../../../routes/PublicRoute";

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, isResettingPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formSchema = z
    .object({
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type ResetPasswordForm = z.infer<typeof formSchema>;

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
    }
  }, [token]);

  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Password reset successful!");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to reset password");
        },
      }
    );
  };

  if (!token) {
    return (
      <PublicRoute>
        <div className="space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Invalid Reset Link
            </h2>
            <p className="mt-4 text-base text-gray-400 max-w-md mx-auto">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <div className="mt-8">
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }

  if (isSuccess) {
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
              Password Reset Successful
            </h2>
            <p className="mt-4 text-base text-gray-400 max-w-md mx-auto">
              Your password has been successfully reset.
            </p>
          </div>

          <div className="rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
              Go to Sign In
            </Link>
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
            Create New Password
          </h2>
          <p className="mt-3 text-base text-gray-400 max-w-md mx-auto">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="pt-2 border-t border-gray-800">
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">
                    Password must contain:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isResettingPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-colors shadow-lg shadow-blue-500/20"
            >
              {isResettingPassword ? (
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
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Back to Sign In
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </PublicRoute>
  );
}
