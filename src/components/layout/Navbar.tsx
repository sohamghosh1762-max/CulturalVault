"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Bookmark, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/context/BookmarksContext";
import { cn } from "@/utils";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useSidebar } from "@/context/SidebarContext";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { count } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];

  const { collapsed, setCollapsed, mobileOpen: sidebarMobileOpen, setMobileOpen: setSidebarMobileOpen } = useSidebar();

  useEffect(() => { 
    setMounted(true); 
    setIsAuth(!!localStorage.getItem("user_token"));
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const authenticatedNavLinks = [
    { href: "/dashboard", label: t.dashboard },
    { href: "/explore", label: t.explore },
    { href: "/chatbot", label: "AI Chat" },
    { href: "/profile", label: "Profile" },
  ];

  const publicNavLinks = [
    { href: "/explore", label: t.explore },
    { href: "/bookmarks", label: t.bookmarks },
    { href: "/risk-map", label: "Risk Dashboard" },
    { label: "Stories", href: "/stories" },
  ];

  const navLinks = isAuth ? authenticatedNavLinks : publicNavLinks;

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 w-full",
      isAuth || scrolled
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
        : "bg-transparent"
    )}>
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section (with hamburger toggle if authenticated) */}
          <div className="flex items-center gap-3">
            {mounted && isAuth && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex p-2 rounded-full hover:bg-secondary/80 text-foreground transition-colors"
                aria-label="Toggle Sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Globe size={16} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold whitespace-nowrap">
                Cultural<span className="text-primary">Vault</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav (hidden if authenticated to avoid duplication with sidebar) */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuth && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label={t.toggleTheme}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/bookmarks"
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label={t.bookmarks}
            >
              <Bookmark size={18} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            
            {mounted && isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-primary hover:underline px-2 hidden sm:block"
                >
                  {t.dashboard}
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("user_token");
                    setIsAuth(false);
                    window.location.href = "/";
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground px-2"
                >
                  {t.logout}
                </button>
              </div>
            ) : mounted && !isAuth ? (
              <Link
                href="/signin"
                className="hidden sm:flex items-center text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors ml-2"
              >
                {t.signIn}
              </Link>
            ) : null}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => {
                if (isAuth) {
                  setSidebarMobileOpen(!sidebarMobileOpen);
                } else {
                  setMobileOpen(!mobileOpen);
                }
              }}
              aria-label={t.menu}
            >
              {isAuth ? (
                sidebarMobileOpen ? <X size={18} /> : <Menu size={18} />
              ) : (
                mobileOpen ? <X size={18} /> : <Menu size={18} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && !isAuth && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
