"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/layout/side ber";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";

const HIDDEN_PATHS = ["/", "/signin", "/signup", "/login", "/admin/login", "/admin/signup"];

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { collapsed } = useSidebar();

  useEffect(() => {
    setMounted(true);
    setIsAuth(!!localStorage.getItem("user_token") || !!localStorage.getItem("adminLoggedIn"));
  }, [pathname]);

  const showSidebar = mounted && isAuth && !HIDDEN_PATHS.includes(pathname);

  return (
    <div className="flex min-h-screen w-full">
      {showSidebar && <Sidebar />}
      <main className={cn(
        "flex-1 transition-all duration-300 w-full",
        showSidebar ? (collapsed ? "md:pl-[72px]" : "md:pl-[240px]") : ""
      )}>
        {children}
      </main>
    </div>
  );
}
