"use client";

import Link from "next/link";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-orange-400 bg-clip-text text-transparent">
                Hopely
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-zinc-700 hover:text-green-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-zinc-700 hover:text-green-600 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-zinc-700 hover:text-green-600 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="px-6 py-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-orange-400 text-white rounded-full hover:from-green-500 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-zinc-600 transform transition duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-zinc-600 mt-1 transition duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-zinc-600 mt-1 transform transition duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-stone-200">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-zinc-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-zinc-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-zinc-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-stone-200">
                  <Link
                    href="/login"
                    className="text-center py-2 text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-center py-2 bg-gradient-to-r from-green-400 to-orange-400 text-white rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
