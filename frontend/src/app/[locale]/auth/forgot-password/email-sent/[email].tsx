import PublicRoute from "@/routes/PublicRoute";
import Link from "next/link";
import { useRouter } from "next/router";

export default function EmailSentPage() {
  const router = useRouter();
  const { email } = router.query;
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
            <strong className="text-white">{email}</strong>. Please check your
            inbox and click the link to reset your password.
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
