"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "../../components/Navigation";

type ApiResponse = {
  success?: boolean;        // if your backend uses boolean
  status?: boolean | string; // if your backend uses "success"/"failure"
  message?: string;
  data?: unknown;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
const LOGIN_URL = `${API_BASE}/auth/login`; // <— change if your service path differs

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // simple remember-me for email field only (JWT is httpOnly & set by the server)
  useEffect(() => {
    const saved = localStorage.getItem("hopely_login_email");
    if (saved) {
      setFormData((p) => ({ ...p, email: saved, rememberMe: true }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // quick client validation
    if (!formData.email || !formData.password) {
      setErr("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // IMPORTANT: do NOT send rememberMe to backend (your Ballerina record is closed)
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        credentials: "include", // <— allows the JWT cookie to be set
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const json: ApiResponse = await res.json().catch(() => ({} as ApiResponse));

      // your backend returns either success: boolean OR status: "success"/"failure"
      const ok =
        (typeof json.success === "boolean" && json.success) ||
        json.status === "success" ||
        (typeof json.status === "boolean" && json.status) ||
        res.ok;

      if (!ok) {
        setErr(json.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // remember email locally if user asked
      if (formData.rememberMe) {
        localStorage.setItem("hopely_login_email", formData.email);
      } else {
        localStorage.removeItem("hopely_login_email");
      }

      // JWT cookie is already set by the server at this point
      router.replace("/"); // or "/dashboard"
    } catch (e) {
      setErr("Unable to reach the server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      <Navigation />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-green-300 to-orange-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-md w-full">
          {/* Login Form */}
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-orange-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-orange-400 bg-clip-text text-transparent">
                  Hopely
                </span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-800 mb-2">Welcome Back</h1>
              <p className="text-zinc-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {err && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-500 border-stone-300 rounded focus:ring-green-400"
                  />
                  <span className="ml-2 text-sm text-zinc-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
                  isLoading
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Social Login (placeholders) */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 rounded-2xl shadow-sm border border-stone-200 bg-white text-sm font-medium text-zinc-500 hover:bg-stone-50 transition-all duration-200"
                  >
                    {/* Google icon */}G
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 rounded-2xl shadow-sm border border-stone-200 bg-white text-sm font-medium text-zinc-500 hover:bg-stone-50 transition-all duration-200"
                  >
                    {/* Twitter icon */}X
                  </button>
                </div>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-zinc-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
