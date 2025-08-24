"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="animate-fade-in-up">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="block text-gray-800">Connecting</span>
                <span className="block bg-gradient-to-r from-emerald-500 to-amber-500 bg-clip-text text-transparent">
                  Hope
                </span>
                <span className="block text-gray-800">with Help</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Hopely bridges the gap between those in need and generous
                hearts. Get medicine, essential donations, and support when you
                need it most.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-xl text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-full font-semibold text-lg hover:bg-emerald-50 transition-all duration-200 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="animate-float">
                <div className="relative w-full h-96 bg-gradient-to-br from-emerald-400 via-emerald-500 to-amber-400 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
                  <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-white">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
                      <svg
                        className="w-12 h-12"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Make a Difference
                    </h3>
                    <p className="text-center opacity-90">
                      Join thousands helping their community
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl animate-bounce opacity-80"></div>
              <div
                className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl animate-bounce opacity-80"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-amber-500 bg-clip-text text-transparent">
                Hopely
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect those who need help with those who can
              provide it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Create Request
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Share your need for medicine or essential items with our caring
                community
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="glass rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Get Matched
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Our system connects you with verified donors who can help with
                your specific needs
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="glass rounded-3xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-amber-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Receive Help
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Get the support you need safely and securely through our trusted
                platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-amber-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join our community today and start helping or get the help you
                need
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                >
                  Join as Helper
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-200"
                >
                  Request Help
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-white bg-opacity-10 animate-shimmer"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-2xl font-bold">Hopely</span>
          </div>
          <p className="text-gray-400 mb-6">
            Connecting hope with help, one person at a time.
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 Hopely. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
