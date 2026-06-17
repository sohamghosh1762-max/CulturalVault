"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SidebarProvider } from "@/context/SidebarContext";
import { Sidebar } from "@/components/layout/side ber";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar =
    pathname !== "/admin/login" &&
    pathname !== "/admin/signup";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {showSidebar && <Sidebar />}
        <main className={showSidebar ? "md:pl-[280px] w-full" : "w-full"}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
