"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-400/5 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-[#143f3f]/8 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300/6 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Universal Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#143f3f]/10 backdrop-blur-sm rounded-full text-[#143f3f] text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-[#143f3f] rounded-full animate-pulse"></div>
              Our Story
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#143f3f] mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                Hopely
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between compassionate hearts and hospitals in
              need. We're transforming healthcare accessibility across Sri
              Lanka, one donation at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Mission */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#143f3f]/10 backdrop-blur-sm rounded-full text-[#143f3f] text-sm font-medium">
                <div className="w-2 h-2 bg-[#143f3f] rounded-full animate-pulse"></div>
                Our Mission
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#143f3f] mb-6">
                Saving Lives Through{" "}
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  Community Support
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At Hopely, we believe that healthcare is a fundamental right,
                not a privilege. Our mission is to create a transparent,
                efficient platform that connects generous donors with hospitals
                facing critical medicine shortages.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#143f3f]/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#143f3f] mb-2">Compassion</h3>
                  <p className="text-gray-600 text-sm">
                    Every action driven by genuine care for human life
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#143f3f]/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-400 rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#143f3f] mb-2">Trust</h3>
                  <p className="text-gray-600 text-sm">
                    Transparent processes and accountable impact
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#143f3f] to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Our Vision
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    A Sri Lanka Where No Patient Goes Without{" "}
                    <span className="text-amber-300">Essential Medicine</span>
                  </h3>
                  <p className="text-white/90 leading-relaxed mb-6">
                    We envision a future where every hospital has the resources
                    they need, every patient receives timely care, and every
                    generous heart finds a meaningful way to contribute to
                    saving lives in their community.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-300">
                        2030
                      </div>
                      <div className="text-sm text-white/70">Target Year</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-300">
                        100%
                      </div>
                      <div className="text-sm text-white/70">
                        Hospital Coverage
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#143f3f] mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Impact
              </span>{" "}
              So Far
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Every donation creates ripples of hope across Sri Lanka's
              healthcare system
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {
                number: "1,247+",
                label: "Lives Saved",
                icon: "heart",
                color: "from-red-500 to-pink-500",
              },
              {
                number: "89",
                label: "Partner Hospitals",
                icon: "building",
                color: "from-blue-500 to-indigo-500",
              },
              {
                number: "₨12.5M",
                label: "Funds Raised",
                icon: "currency",
                color: "from-green-500 to-emerald-500",
              },
              {
                number: "3,890+",
                label: "Active Donors",
                icon: "users",
                color: "from-purple-500 to-violet-500",
              },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#143f3f]/10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon === "heart" && (
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
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
                  <h3 className="text-3xl font-bold text-[#143f3f] mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#143f3f] mb-6">
              How We{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Operate
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Transparency, efficiency, and impact at every step of our process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Hospital Partnership",
                description:
                  "We partner with verified hospitals across Sri Lanka, ensuring genuine needs and proper documentation.",
                icon: "handshake",
              },
              {
                step: "02",
                title: "Transparent Requests",
                description:
                  "Hospitals submit detailed medicine requirements with real-time updates on funding progress.",
                icon: "document",
              },
              {
                step: "03",
                title: "Secure Donations",
                description:
                  "Donors contribute through our secure platform with full transparency on fund utilization.",
                icon: "shield",
              },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#143f3f]/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="w-16 h-16 bg-[#143f3f]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#143f3f]/20 transition-colors duration-300">
                      {item.icon === "handshake" && (
                        <svg
                          className="w-8 h-8 text-[#143f3f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                      )}
                      {item.icon === "document" && (
                        <svg
                          className="w-8 h-8 text-[#143f3f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                      {item.icon === "shield" && (
                        <svg
                          className="w-8 h-8 text-[#143f3f]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#143f3f] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#143f3f] via-emerald-700 to-[#143f3f]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Join Our{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              Life-Saving
            </span>{" "}
            Mission
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Every donation, no matter the size, has the power to save a life.
            Together, we can ensure that no patient in Sri Lanka goes without
            essential medicine.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/donation"
              className="group px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-[#143f3f] rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span>Start Donating</span>
              </div>
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
