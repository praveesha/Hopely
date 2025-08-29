// Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`transition-colors ${active ? "text-green-700 font-medium" : "text-zinc-700 hover:text-green-600"}`}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-orange-400 rounded-lg grid place-items-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-orange-400 bg-clip-text text-transparent">
                Hopely
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {link("/", "Donate")}
              {link("/medicine", "Medicine")}
              {link("/help", "Help")}
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-stone-100"
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-zinc-600 transition ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block w-5 h-0.5 bg-zinc-600 mt-1 transition ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-zinc-600 mt-1 transition ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-stone-200 flex flex-col gap-4">
              {link("/", "Donate")}
              {link("/medicine", "Medicine")}
              {link("/help", "Help")}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
