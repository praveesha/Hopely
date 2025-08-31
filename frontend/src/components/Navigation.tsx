"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#143f3f] shadow-2xl py-2" : "bg-[#143f3f] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Full height when part of hero, smaller when sticky */}
          <div className="flex items-center">
            <Link
              href="/"
              className="transition-transform duration-200 hover:scale-105"
            >
              <Image
                src="/HopelyLogo.png"
                alt="Hopely"
                width={isScrolled ? 56 : 80}
                height={isScrolled ? 56 : 80}
                className="object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/donation"
              className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
            >
              Donate
            </Link>
            <Link
              href="/about"
              className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
            >
              Impact Stories
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-6 py-2 text-amber-300 hover:text-white font-medium transition-colors duration-200"
            >
              Hospital Login
            </Link>
            <Link
              href="/donation"
              className={`px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-[#143f3f] rounded-full hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-bold ${
                isScrolled ? "text-sm" : ""
              }`}
            >
              💛 Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-white transform transition duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white mt-1 transition duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white mt-1 transform transition duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link
                href="/donation"
                className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </Link>
              <Link
                href="/about"
                className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="#"
                className="text-white/90 hover:text-amber-300 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Impact Stories
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
                <Link
                  href="/login"
                  className="text-center py-2 text-amber-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hospital Login
                </Link>
                <Link
                  href="/donation"
                  className="text-center py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-[#143f3f] rounded-full font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💛 Donate Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
