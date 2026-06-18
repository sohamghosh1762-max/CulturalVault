import Link from "next/link";
import { Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-800/30 bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Globe size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-foreground">
              Cultural<span className="text-primary">Vault</span>
            </span>
          </Link>

          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Built with <Heart size={12} className="text-rose-500 fill-rose-500" /> for cultural heritage
          </p>

          <nav className="flex gap-5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Explore</Link>
            <Link href="/bookmarks" className="hover:text-foreground transition-colors">Collection</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
