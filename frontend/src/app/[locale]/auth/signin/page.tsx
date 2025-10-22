"use client";

import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

type SignInForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const t = useTranslations("SignIn");
  const { signIn, isSigningIn, signInError } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInForm>();

  useEffect(() => {
    if (signInError) {
      toast.error(signInError.message);
    }
  }, [signInError]);

  const onSubmit = (data: SignInForm) => {
    signIn(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("email")}
              </label>
              <Input
                {...register("email", { required: "Email is required" })}
                id="email"
                type="email"
                placeholder={t("email-placeholder")}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {t("password")}
              </label>
              <Input
                {...register("password", { required: "Password is required" })}
                id="password"
                type="password"
                placeholder={t("password-placeholder")}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSigningIn} className="w-full">
            {isSigningIn ? t("Signing in...") : t("Sign In")}
          </Button>
        </form>
      </div>
    </div>
  );
}
