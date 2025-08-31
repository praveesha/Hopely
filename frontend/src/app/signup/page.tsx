"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "../../components/Navigation";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "recipient", // recipient or donor
    terms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Calculate password strength
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
        return "Strong";
      default:
        return "Weak";
    }
  };

  const getPasswordStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Sign up attempt:", formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      <Navigation />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-60 left-20 w-24 h-24 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-orange-300 to-green-200 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
        <div className="max-w-lg w-full">
          {/* Sign Up Form */}
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
              <h1 className="text-3xl font-bold text-zinc-800 mb-2">
                Join Our Community
              </h1>
              <p className="text-zinc-600">
                Create your account to start helping or get help
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-3">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      formData.userType === "recipient"
                        ? "border-green-400 bg-green-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value="recipient"
                      checked={formData.userType === "recipient"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex-1 text-center">
                      <div
                        className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                          formData.userType === "recipient"
                            ? "bg-green-400 text-white"
                            : "bg-stone-200 text-zinc-500"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Get Help</span>
                    </div>
                  </label>

                  <label
                    className={`relative flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      formData.userType === "donor"
                        ? "border-orange-400 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value="donor"
                      checked={formData.userType === "donor"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex-1 text-center">
                      <div
                        className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                          formData.userType === "donor"
                            ? "bg-orange-400 text-white"
                            : "bg-stone-200 text-zinc-500"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Help Others</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  placeholder="Create a strong password"
                  required
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-zinc-600">
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength >= 4
                            ? "text-green-600"
                            : passwordStrength >= 2
                            ? "text-orange-500"
                            : "text-red-600"
                        }`}
                      >
                        {getPasswordStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                          passwordStrength
                        )}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                  placeholder="Confirm your password"
                  required
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-500 border-stone-300 rounded focus:ring-green-400 mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-sm text-zinc-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.terms}
                className={`w-full py-3 px-4 rounded-2xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
                  isLoading || !formData.terms
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-400 to-orange-400 hover:from-green-500 hover:to-orange-500"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Social Sign Up */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 rounded-2xl shadow-sm border border-stone-200 bg-white text-sm font-medium text-zinc-500 hover:bg-stone-50 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 rounded-2xl shadow-sm border border-stone-200 bg-white text-sm font-medium text-zinc-500 hover:bg-stone-50 transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    <span className="ml-2">Twitter</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-zinc-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
