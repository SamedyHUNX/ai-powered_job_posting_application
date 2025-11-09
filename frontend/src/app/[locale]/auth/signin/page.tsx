"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
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
import PublicRoute from "../../../../../routes/PublicRoute";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof formSchema>;

export default function SigninPage() {
  const t = useTranslations("signIn");
  const { signIn, isSigningIn, signInError } = useAuth();

  const form = useForm<SignInForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (signInError) {
      toast.error(signInError.message);
    }
  }, [signInError]);

  const onSubmit = (data: SignInForm) => {
    signIn(data);
  };

  return (
    <PublicRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please sign in to your account
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 rounded-lg bg-gray-900 p-8 shadow-xl border border-gray-800">
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

              <div className="pt-2">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
            >
              {isSigningIn ? t("loadingText") : t("buttonText")}
            </Button>
          </form>
        </Form>
      </div>
    </PublicRoute>
  );
}
