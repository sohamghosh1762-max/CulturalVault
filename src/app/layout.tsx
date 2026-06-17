import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";


import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { BookmarksProvider } from "@/context/BookmarksContext";
import { LanguageProvider } from "@/context/LanguageContext";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";
import { SidebarProvider } from "@/context/SidebarContext";


export const metadata: Metadata = {
  title: "CulturalVault — World Heritage Explorer",
  description: "Discover and explore the world's most remarkable cultural heritage sites, traditions, and art forms.",
  keywords: ["culture", "heritage", "art", "history", "travel", "UNESCO"],
  openGraph: {
    title: "CulturalVault — World Heritage Explorer",
    description: "Discover the world's most remarkable cultural heritage.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <BookmarksProvider>
              <SidebarProvider>
                <Navbar />
                <SidebarWrapper>{children}</SidebarWrapper>
                <Footer />
              </SidebarProvider>
              <Toaster />
            </BookmarksProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
