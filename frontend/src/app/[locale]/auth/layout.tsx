// app/auth/layout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left side - Form Content */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 relative">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 opacity-90" />

        {/* Background Image */}
        <img
          src="/auth-background.jpg"
          alt="Authentication"
          className="object-cover w-full h-full"
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-lg">
            <h3 className="text-5xl font-bold mb-6">Welcome to JobPosting</h3>
            <h5 className="text-md mb-6">by samedyhunx</h5>
            <p className="text-xl opacity-90 leading-relaxed">
              Join thousands of job-seekers and start your journey with us today
            </p>
            {/* Optional: Add decorative elements */}
            <div className="mt-12 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold">1K+</div>
                <div className="text-sm opacity-75 mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">50+</div>
                <div className="text-sm opacity-75 mt-1">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">4.9★</div>
                <div className="text-sm opacity-75 mt-1">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
