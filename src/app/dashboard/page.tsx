"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ItemGrid } from "@/components/cards/ItemGrid";
import { useItems } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { useBookmarks } from "@/context/BookmarksContext";

export default function DashboardPage() {
  const { items, loading, error } = useItems({}, 1);
  const { bookmarks } = useBookmarks();
  const [greeting, setGreeting] = useState("Welcome back");
  const [profile, setProfile] = useState<any>(null);
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [viewFilter, setViewFilter] = useState("all");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    let stored = localStorage.getItem("user_profile");
    if (!stored && localStorage.getItem("user_token")) {
      const defaultUser = {
        id: "u1",
        name: "Demo User",
        email: "demo@culturalvault.com",
        image: "",
        interests: ["Architecture", "Art"],
        createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      };
      localStorage.setItem("user_profile", JSON.stringify(defaultUser));
      stored = JSON.stringify(defaultUser);
    }
    if (stored) {
      const user = JSON.parse(stored);
      if (!localStorage.getItem("userAccount")) {
        localStorage.setItem("userAccount", JSON.stringify({
          id: user.id || "u1",
          name: user.name,
          email: user.email
        }));
      }
      setProfile(user);
    }

    const history = localStorage.getItem("recently_viewed_history");
    if (history) {
      setRecentViews(JSON.parse(history));
    }
  }, []);

  const getJoinedText = () => {
    if (!profile) return "Joined just now";
    const createdAt = profile.createdAt || (Date.now() - 24 * 60 * 60 * 1000);
    const diffTime = Math.abs(Date.now() - new Date(createdAt).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Joined today";
    if (diffDays === 1) return "Joined yesterday";
    return `Active for ${diffDays} days`;
  };

  const getRecommendedItems = () => {
    if (!items || items.length === 0) return [];
    if (!profile || !profile.interests || profile.interests.length === 0) {
      return items.slice(0, 4);
    }
    const matched = items.filter((item) =>
      profile.interests.some((interest: string) =>
        item.category.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(item.category.toLowerCase())
      )
    );
    const unmatched = items.filter((item) =>
      !profile.interests.some((interest: string) =>
        item.category.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(item.category.toLowerCase())
      )
    );
    return [...matched, ...unmatched].slice(0, 4);
  };

  const recommendedItems = getRecommendedItems();

  return (
    <PageWrapper className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Dashboard Header Profile */}
      <section className="relative h-[35vh] w-full bg-muted overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80"
          alt="Dashboard Cover"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute bottom-0 w-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex items-end gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-background overflow-hidden bg-primary shadow-xl shrink-0">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-4xl font-bold text-white uppercase">
                  {profile?.name ? profile.name.charAt(0) : "U"}
                </div>
              )}
            </div>
            <div className="mb-2 drop-shadow-md">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                {greeting}, {profile?.name || "User"}!
              </h1>
              <p className="text-muted-foreground mt-1">Cultural Explorer • {getJoinedText()}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Dashboard Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Items Explored", value: "142", href: null },
            { label: "Collections", value: String(bookmarks.length), href: "/bookmarks" },
            { label: "Contributions", value: "0", href: null },
            { label: "Curator Rank", value: "Novice", href: null },
          ].map((stat, i) => {
            const content = (
              <>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </>
            );

            if (stat.href) {
              return (
                <Link key={i} href={stat.href} className="block group">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/45 hover:bg-secondary/40 transition-all duration-300 cursor-pointer shadow-sm group-hover:scale-[1.03]"
                  >
                    {content}
                  </motion.div>
                </Link>
              );
            }

            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="glass p-6 rounded-2xl border border-white/5"
              >
                {content}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Recently Viewed History */}
      {recentViews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              🕒 Recently Viewed History
            </h2>
            
            <div className="flex items-center gap-2">
              <label htmlFor="historyFilter" className="text-xs text-muted-foreground font-medium">Filter by:</label>
              <select
                id="historyFilter"
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
                className="bg-card border border-white/10 hover:border-primary/50 text-foreground text-xs font-semibold rounded-xl px-3 py-2 outline-none transition cursor-pointer"
              >
                <option value="all">All Views</option>
                <option value="article">Blogs & Articles</option>
                <option value="story">Stories</option>
                <option value="community">Community Heritage</option>
                <option value="risk">Risk Dashboard</option>
              </select>
            </div>
          </div>

          {recentViews.filter(item => viewFilter === "all" || item.type === viewFilter).length === 0 ? (
            <div className="border border-dashed rounded-3xl p-10 bg-card/50 text-center text-muted-foreground text-xs italic">
              No recently viewed {viewFilter === "all" ? "items" : viewFilter === "article" ? "blogs & articles" : viewFilter === "story" ? "stories" : viewFilter === "community" ? "community posts" : "risk dashboard events"} found under this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentViews
                .filter(item => viewFilter === "all" || item.type === viewFilter)
                .map((item, i) => {
                  const typeColors: Record<string, string> = {
                    story: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    article: "bg-sky-500/10 text-sky-500 border-sky-500/20",
                    community: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    risk: "bg-rose-500/10 text-rose-500 border-rose-500/20",
                  };
                  const typeLabels: Record<string, string> = {
                    story: "Oral Story",
                    article: "Article / Item",
                    community: "Community Heritage",
                    risk: "Risk Dashboard",
                  };
                  return (
                    <Link
                      key={i}
                      href={item.path}
                      className="glass p-5 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-secondary/40 transition-all duration-300 group flex flex-col justify-between animate-fade-in"
                    >
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${typeColors[item.type] || "bg-muted text-muted-foreground border-border"}`}>
                          {typeLabels[item.type] || item.type}
                        </span>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm mt-3.5 line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-3">
                        <span className="font-medium text-primary/80">{item.category || "General"}</span>
                        <span className="text-[10px]">{new Date(item.viewedAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </section>
      )}

      {/* Recommended or Saved Items Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recommended for You, {profile?.name || "User"}</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Based on your interests: {profile?.interests && profile.interests.length > 0 ? profile.interests.join(", ") : "General"}</p>
          </div>
          <Link href="/explore" className="px-5 py-2 border border-border hover:bg-muted text-sm font-medium rounded-xl transition-colors shrink-0 self-start sm:self-auto">
            Explore All
          </Link>
        </div>

        {profile?.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs font-semibold text-muted-foreground mr-1 self-center">Your Active Interests:</span>
            {profile.interests.map((interest: string) => (
              <span key={interest} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-medium">
                {interest}
              </span>
            ))}
          </div>
        )}

        <ItemGrid items={recommendedItems} loading={loading} error={error} />
      </motion.section>
    </PageWrapper>
  );
}
