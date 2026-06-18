"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ShieldAlert,
  X,
  ScrollText,
  LayoutDashboard,
  MessageSquare,
  Mic,
  User,
  Bookmark,
  LogOut,
  Globe
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";

export function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  // HIDE SIDEBAR ON THE FRONT PAGE & AUTH PAGES
  if (
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/admin/signup"
  )
    return null;

  // 1. Core Links (Visible in Collapsed View & Top of Expanded View)
  const coreLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/chat", label: "AI Chat", icon: MessageSquare },
    { href: "/profile", label: "Profile", icon: User },
  ];

  // 2. Extra Links (Shown in Expanded View under "Overall Features")
  const extraLinks = [
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/risk-map", label: "Risk Dashboard", icon: ShieldAlert },
    { href: "/stories", label: "Stories", icon: ScrollText },
    { href: "/oral-story", label: "Oral Story", icon: Mic },
  ];

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const isCollapsed = !isMobile && collapsed;

    // Render for Collapsed (Compact) Desktop View
    const renderCollapsedLink = (item: { href: string; label: string; icon: any }) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "w-full py-4 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200",
            isActive
              ? "bg-secondary text-primary font-semibold shadow-sm"
              : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
          )}
          title={item.label}
        >
          <item.icon size={22} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
          <span className="text-[10px] tracking-wide mt-1 font-medium">{item.label}</span>
        </Link>
      );
    };

    // Render for Expanded (Full List) View
    const renderExpandedLink = (item: { href: string; label: string; icon: any }) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => isMobile && setMobileOpen(false)}
          className={cn(
            "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap",
            isActive
              ? "bg-secondary text-primary font-semibold shadow-sm"
              : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          <item.icon size={20} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
          <span className="text-sm">{item.label}</span>
        </Link>
      );
    };

    return (
      <div className="flex flex-col h-full bg-background">
        {/* Mobile Header (Only visible inside mobile drawer) */}
        {isMobile && (
          <div className="h-16 flex items-center px-4 shrink-0 border-b border-border/50 gap-3">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-secondary text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                <Globe size={16} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold">
                Cultural<span className="text-primary">Vault</span>
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className={cn(
          "flex-1 flex flex-col overflow-y-auto py-3 custom-scrollbar",
          isCollapsed ? "px-1.5 gap-2" : "px-3 gap-1"
        )}>
          {isCollapsed ? (
            // Collapsed Desktop View
            coreLinks.map(renderCollapsedLink)
          ) : (
            // Expanded/Mobile View
            <>
              {coreLinks.map(renderExpandedLink)}
              
              <div className="my-3 border-t border-border/50" />
              
              <div className="px-3 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Overall Features
                </span>
              </div>
              
              {extraLinks.map(renderExpandedLink)}

              <div className="flex-1 min-h-[40px]" />
              
              <div className="my-2 border-t border-border/50" />
              
              <button
                onClick={() => {
                  localStorage.removeItem("user_token");
                  window.location.href = "/";
                }}
                className="flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-500/10 font-medium whitespace-nowrap mb-2 animate-fade-in"
              >
                <LogOut size={20} />
                <span className="text-sm">Log Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:block fixed left-0 top-16 h-[calc(100vh-64px)] z-40 overflow-hidden bg-background border-r"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[270px] z-50 bg-background shadow-2xl"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}