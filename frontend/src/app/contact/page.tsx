"use client";

import { useState } from "react";
import Navigation from "../../components/Navigation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      type: "general",
    });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              Get In Touch
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#143f3f] mb-6">
              Contact{" "}
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                Hopely
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Have questions about our mission? Need support with donations?
              Want to partner with us? We're here to help and would love to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#143f3f] mb-6">
                    Let's{" "}
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                      Connect
                    </span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    We're committed to transparency, support, and building
                    meaningful relationships with our community. Reach out to us
                    through any of these channels.
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#143f3f]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#143f3f] mb-1">
                          Email Us
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          For general inquiries and support
                        </p>
                        <a
                          href="mailto:info@hopely.lk"
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          info@hopely.lk
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#143f3f]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#143f3f] mb-1">
                          Call Us
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Monday to Friday, 9 AM - 6 PM
                        </p>
                        <a
                          href="tel:+94112345678"
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          +94 11 234 5678
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#143f3f]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#143f3f] mb-1">
                          Visit Us
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Our office in Colombo
                        </p>
                        <p className="text-amber-600 font-medium">
                          123 Galle Road
                          <br />
                          Colombo 03, Sri Lanka
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-red-800">
                      Urgent Medical Support
                    </h3>
                  </div>
                  <p className="text-red-700 text-sm mb-3">
                    For critical medical emergencies requiring immediate
                    attention
                  </p>
                  <a
                    href="tel:+94771234567"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +94 77 123 4567
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#143f3f]/10">
                <h3 className="text-2xl font-bold text-[#143f3f] mb-6">
                  Send Us a Message
                </h3>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                      <div>
                        <h4 className="font-medium text-green-800">
                          Message sent successfully!
                        </h4>
                        <p className="text-green-600 text-sm">
                          We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="donation">Donation Support</option>
                      <option value="hospital">Hospital Partnership</option>
                      <option value="technical">Technical Issue</option>
                      <option value="press">Press & Media</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span>Send Message</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#143f3f] mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-700">
              Quick answers to common questions about Hopely
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question:
                  "How do I know my donation reaches the right hospital?",
                answer:
                  "Every donation is tracked transparently through our platform. You'll receive updates on fund utilization and can see exactly how your contribution helped save lives.",
              },
              {
                question: "Are my donations tax-deductible?",
                answer:
                  "Yes, Hopely is a registered charitable organization in Sri Lanka. We provide official receipts for all donations that can be used for tax deduction purposes.",
              },
              {
                question:
                  "Can hospitals from anywhere in Sri Lanka join the platform?",
                answer:
                  "We welcome hospitals from all regions of Sri Lanka. Each hospital goes through our verification process to ensure legitimacy and proper documentation.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept major credit cards, debit cards, and online banking through our secure PayHere integration. All transactions are encrypted and secure.",
              },
              {
                question: "How quickly do hospitals receive the funds?",
                answer:
                  "Once a funding goal is reached, hospitals typically receive funds within 24-48 hours to ensure they can purchase medicines immediately.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#143f3f]/10"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-semibold text-[#143f3f] text-lg pr-4">
                      {faq.question}
                    </h3>
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center group-open:bg-amber-200 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-amber-600 transform group-open:rotate-45 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
