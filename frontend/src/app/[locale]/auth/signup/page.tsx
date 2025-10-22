"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { toast } from "sonner";

type SignUpFormData = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const { signUp, isSigningUp, signUpError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  useEffect(() => {
    if (signUpError) {
      toast.error(signUpError.message);
    }
  }, [signUpError]);

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">Join us today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningUp ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
