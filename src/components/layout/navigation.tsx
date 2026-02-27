"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dictionary } from "@/i18n/config";

interface NavigationProps {
  dictionary: Dictionary;
  lang: string;
}

export function Navigation({ dictionary, lang }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserRole(userData.role || "");
    }
  }, []);

  // Determine profile link based on user role
  const profileLink = userRole === "teacher" || userRole === "admin" ? "/teacher" : "/student?section=profile";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const navLinks = [
    { href: `/${lang}`, label: dictionary.nav.home, needsScroll: false },
    { href: `/${lang}#features`, label: dictionary.nav.courses, needsScroll: true },
    { href: `/${lang}#pricing`, label: dictionary.nav.trust, needsScroll: true },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string, needsScroll: boolean) => {
    if (needsScroll && href.includes("#")) {
      e.preventDefault();
      const sectionId = href.split("#")[1];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">
              جنة الأطفال
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href, link.needsScroll)}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {lang === "en" ? "عربي" : "EN"}
            </button>
            {isLoggedIn ? (
              <>
                <Link
                  href={profileLink}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {dictionary.nav.profile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {dictionary.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${lang}/login`}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {dictionary.nav.login}
                </Link>
                <Link
                  href={`/${lang}/register`}
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {dictionary.nav.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-white/5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      scrollToSection(e, link.href, link.needsScroll);
                      setIsOpen(false);
                    }}
                    className="block px-3 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-3 border-t border-white/5">
                  {/* Language Switcher Mobile */}
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 w-full px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {lang === "en" ? "العربية" : "English"}
                  </button>
                  {isLoggedIn ? (
                    <>
                      <Link
                        href={profileLink}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-3 text-base font-medium bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg text-center hover:opacity-90 transition-opacity"
                      >
                        {dictionary.nav.profile}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="block w-full px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-right"
                      >
                        {dictionary.nav.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/${lang}/login`}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-3 text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        {dictionary.nav.login}
                      </Link>
                      <Link
                        href={`/${lang}/register`}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-3 text-base font-medium bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg text-center hover:opacity-90 transition-opacity"
                      >
                        {dictionary.nav.register}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
