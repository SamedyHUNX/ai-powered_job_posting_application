"use client";

import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";

type SignInForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { signIn, isSigningIn, signInError } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInForm>();

  const onSubmit = (data: SignInForm) => {
    signIn(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {signInError && <p>Error: {signInError.message}</p>}
      <div>
        <input
          {...register("email", { required: "Email is required" })}
          type="text"
          placeholder="Name"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <input
          {...register("password", { required: "Password is required" })}
          type="text"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <button type="submit" disabled={isSigningIn}>
        {isSigningIn ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
