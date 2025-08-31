"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Universal Navigation */}
      <Navigation />

      {/* Hero Section with Dark Green Background */}
      <section className="min-h-screen bg-gradient-to-br from-[#143f3f] via-[#1a4f4f] to-[#143f3f] relative overflow-hidden">
        {/* Background Decorative Stripes and Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Diagonal Stripes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-96 h-2 bg-amber-400 transform rotate-45"></div>
            <div className="absolute top-20 -left-40 w-96 h-1 bg-yellow-400 transform rotate-45"></div>
            <div className="absolute top-60 -left-60 w-96 h-3 bg-amber-300 transform rotate-45"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-2 bg-yellow-500 transform rotate-45"></div>
            <div className="absolute bottom-40 -right-40 w-96 h-1 bg-amber-500 transform rotate-45"></div>
            <div className="absolute bottom-80 -right-60 w-96 h-3 bg-yellow-400 transform rotate-45"></div>
          </div>

          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full mix-blend-soft-light filter blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-amber-400/10 rounded-full mix-blend-soft-light filter blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300/8 rounded-full mix-blend-soft-light filter blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Medical Cross Pattern */}
          <div className="absolute top-32 right-20 opacity-5">
            <div className="w-20 h-2 bg-amber-400"></div>
            <div className="w-2 h-20 bg-amber-400 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-9"></div>
          </div>
          <div className="absolute bottom-32 left-20 opacity-5">
            <div className="w-16 h-1.5 bg-yellow-400"></div>
            <div className="w-1.5 h-16 bg-yellow-400 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-7"></div>
          </div>

          {/* Geometric Shapes */}
          <div className="absolute top-40 right-40 w-12 h-12 border-2 border-amber-400/20 rotate-45"></div>
          <div className="absolute bottom-40 left-40 w-8 h-8 bg-yellow-400/20 rounded-full"></div>
          <div className="absolute top-80 left-80 w-6 h-6 bg-amber-300/20 transform rotate-12"></div>
        </div>

        {/* Hero Content */}
        <div className="flex items-center justify-center min-h-screen px-6 pt-32 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left side - Content */}
              <div className="animate-fade-in-up space-y-8 text-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
                  <span className="block">Bridging Hope</span>
                  <span className="block bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    With Healing
                  </span>
                  <span className="block">For Everyone</span>
                </h1>

                <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                  Connecting compassionate hearts with hospitals in need. Your
                  generosity provides essential medicines and medical supplies,
                  transforming lives and bringing hope to communities across Sri
                  Lanka.
                </p>

                {/* Prominent Donate Now Button */}
                <div className="flex flex-col sm:flex-row gap-6 items-center lg:items-start justify-center lg:justify-start">
                  <Link
                    href="/donation"
                    className="group relative px-12 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-[#143f3f] rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <svg
                        className="w-7 h-7 group-hover:scale-110 transition-transform duration-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      <span>DONATE NOW</span>
                      <svg
                        className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>

                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-transparent border-3 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-amber-300 transition-all duration-300 transform hover:scale-105"
                  >
                    Join Our Mission
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-8 pt-8 justify-center lg:justify-start">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      500+
                    </div>
                    <div className="text-sm text-white/70">Lives Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      50+
                    </div>
                    <div className="text-sm text-white/70">
                      Hospitals Helped
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                      ₨2M+
                    </div>
                    <div className="text-sm text-white/70">
                      Donations Raised
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Medical Illustration */}
              <div className="relative">
                <div className="relative">
                  {/* Large Central Medical Icon */}
                  <div className="w-80 h-80 mx-auto bg-gradient-to-br from-white/20 to-amber-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl animate-float">
                    <div className="w-48 h-48 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-lg shadow-xl">
                      <svg
                        className="w-24 h-24 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Subtle Pulse Rings */}
                  <div className="absolute inset-0 -m-10">
                    <div className="w-full h-full border-2 border-amber-300/30 rounded-full animate-ping"></div>
                  </div>
                  <div className="absolute inset-0 -m-20">
                    <div
                      className="w-full h-full border border-yellow-300/20 rounded-full animate-ping"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remove the duplicate Navigation component since it's now integrated */}

      {/* Background Decorative Elements for Other Sections */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-400/8 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/12 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Impact Statistics Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#143f3f]/10 backdrop-blur-sm rounded-full text-[#143f3f] text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-[#143f3f] rounded-full animate-pulse"></div>
              Real-Time Impact
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#143f3f] mb-6">
              Lives We've{" "}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                Transformed
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every donation creates a ripple effect of hope, healing, and
              happiness in our community
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "1,247", label: "Lives Saved", icon: "heart" },
              { number: "89", label: "Hospitals Supported", icon: "building" },
              { number: "₨12.5M", label: "Funds Raised", icon: "currency" },
              { number: "3,890", label: "Generous Donors", icon: "users" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="glass rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#143f3f]/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {stat.icon === "heart" && (
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {stat.icon === "building" && (
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    )}
                    {stat.icon === "currency" && (
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    )}
                    {stat.icon === "users" && (
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-[#143f3f] mb-2 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Separator */}
      <div className="relative py-8 bg-gradient-to-b from-white/50 via-gray-50/50 to-gray-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">
            {/* Gradient Line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#143f3f]/30 to-transparent"></div>

            {/* Center Icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-white border-2 border-[#143f3f]/20 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#143f3f] mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                Hopely
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Simple, secure, and transparent process to connect hospitals with
              life-saving donations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group animate-fade-in-up">
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#143f3f]/10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#143f3f] mb-4 text-center">
                  Hospital Posts Need
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Hospitals share their urgent medicine and supply requirements
                  with transparent funding goals and real-time progress tracking
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="group animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#143f3f]/10">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-400 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-white"
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
                <h3 className="text-2xl font-bold text-[#143f3f] mb-4 text-center">
                  You Donate Securely
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Choose your contribution amount and donate securely through
                  our trusted PayHere integration with full transparency
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="group animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-[#143f3f]/10">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#143f3f] mb-4 text-center">
                  Lives Are Saved
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Hospitals receive funds instantly, purchase medicines, and
                  provide life-saving care to patients in need
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#143f3f] via-emerald-700 to-[#143f3f]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Emergency Medical Needs Await Your Support
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Every Second Counts.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Every Donation Saves Lives.
            </span>
          </h2>

          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Right now, hospitals across Sri Lanka are running short of critical
            medicines. Your donation can be the difference between life and
            death for someone's loved one.
          </p>

          {/* Super Prominent Donate Now Button */}
          <div className="flex flex-col items-center gap-8">
            <Link
              href="/donation"
              className="group relative px-16 py-6 bg-white text-[#143f3f] rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#143f3f] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </div>
                <span>DONATE NOW</span>
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg
                    className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/0 via-emerald-100/30 to-emerald-100/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>

            <div className="text-white/80 text-center">
              <p className="text-lg mb-4">
                Join 3,890+ generous donors who've already made a difference
              </p>
              <div className="flex justify-center">
                <Link
                  href="/hospital/dashboard"
                  className="px-8 py-3 bg-transparent border-2 border-white/50 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Hospital Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#143f3f] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Link
                href="/"
                className="transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src="/HopelyLogo.png"
                  alt="Hopely"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </Link>
            </div>
            <p className="text-emerald-200 mb-8 text-lg max-w-2xl mx-auto">
              Connecting hope with help, transforming lives through
              community-driven healthcare support.
            </p>

            {/* Quick Links */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="font-semibold mb-4 text-emerald-300">
                  For Donors
                </h4>
                <ul className="space-y-2 text-white/80">
                  <li>
                    <Link
                      href="/donation"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Browse Needs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Create Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/impact"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Track Impact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-emerald-300">
                  For Hospitals
                </h4>
                <ul className="space-y-2 text-white/80">
                  <li>
                    <Link
                      href="/hospital/dashboard"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Hospital Portal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Register Hospital
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Support Center
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-emerald-300">
                  Resources
                </h4>
                <ul className="space-y-2 text-white/80">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-it-works"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-emerald-300">Legal</h4>
                <ul className="space-y-2 text-white/80">
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-emerald-300 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 Hopely. All rights reserved. | Saving lives through
              community support.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
