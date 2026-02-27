"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dictionary } from "@/i18n/config";

interface FooterProps {
  dictionary: Dictionary;
  lang: string;
}

export function Footer({ dictionary, lang }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                جنة الأطفال
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-400 max-w-xs">
              {dictionary.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dictionary.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {[
                { href: `/${lang}`, label: dictionary.nav.home },
                { href: `/${lang}#features`, label: dictionary.nav.courses },
                { href: `/${lang}#pricing`, label: dictionary.nav.trust },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dictionary.footer.support}
            </h3>
            <ul className="space-y-3">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      href="/student?section=profile"
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {dictionary.nav.profile}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {dictionary.nav.logout}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href={`/${lang}/login`}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {dictionary.nav.login}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${lang}/register`}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {dictionary.nav.register}
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {dictionary.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {dictionary.nav.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {dictionary.footer.legal}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "#", label: dictionary.footer.privacy },
                { href: "#", label: dictionary.footer.terms },
                { href: "#", label: dictionary.footer.cookies },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-sm text-zinc-500">
            © {currentYear} جنة الأطفال. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
