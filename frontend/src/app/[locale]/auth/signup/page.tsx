"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";

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

  const onSubmit = (data: SignUpFormData) => {
    signUp(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {signUpError && <p>Error: {signUpError.message}</p>}

      <div>
        <input
          {...register("name", { required: "Name is required" })}
          type="text"
          placeholder="Name"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register("firstName", { required: "First name is required" })}
          type="text"
          placeholder="First Name"
        />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <input
          {...register("lastName", { required: "Last name is required" })}
          type="text"
          placeholder="Last Name"
        />
        {errors.lastName && <p>{errors.lastName.message}</p>}
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
        />
        {errors.email && <p>{errors.email.message}</p>}
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
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSigningUp}>
        {isSigningUp ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
