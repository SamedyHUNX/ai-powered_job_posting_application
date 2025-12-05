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
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useErrorHandler } from "@/utils/errorHandler";
import {
  createSignInSchema,
  SignInFormData,
} from "@/schemas/auth/signInSchema";
import { Loading } from "@/components/customs/Loading";

export default function SigninPage() {
  // Translations
  const t = useTranslations();
  const signInT = (key: string) => t(`signIn.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);
  const successT = (key: string) => t(`apiSuccess.${key}`);

  const { signIn, isSigningIn, signInError, signInSuccess } = useAuth();
  const { getErrorMessage } = useErrorHandler();

  const signInFormSchema = useMemo(
    () => createSignInSchema(validationT),
    [validationT]
  );

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    mode: "onChange", // Enable real-time validation
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

  useEffect(() => {
    if (signInSuccess) {
      toast.success(successT("signInSuccess"));
    }
  }, [signInSuccess, signInT]);

  if (isSigningIn) {
    return <Loading />;
  }

  const onSubmit = (data: SignInFormData) => {
    signIn(data);
  };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {signInT("title")}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {signInT("titleDesc")}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5 rounded-lg bg-white dark:bg-gray-900 p-8 shadow-xl border border-gray-200 dark:border-gray-800">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signInT("emailLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder={signInT("emailPlaceholder")}
                      className={`w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
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

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    {signInT("passwordLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder={signInT("passwordPlaceholder")}
                      className={`w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
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

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                {signInT("forgotPassword")}
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
          >
            {isSigningIn ? signInT("loadingText") : signInT("buttonText")}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {signInT("dontHaveAnAccount")}{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                {signInT("signUp")}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
