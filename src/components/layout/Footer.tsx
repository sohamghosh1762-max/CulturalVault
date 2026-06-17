import Link from "next/link";
import { Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Globe size={14} className="text-white" />
            </div>
            <span className="font-display font-bold">
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
