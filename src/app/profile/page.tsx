"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "Explorer", email: "user@example.com" });

  useEffect(() => {
    const stored = localStorage.getItem("user_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <PageWrapper className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{profile.name.charAt(0)}</div>
            <div>
              <p className="text-sm text-muted-foreground">Profile</p>
              <h1 className="text-2xl font-semibold">{profile.name}</h1>
            </div>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Member Since</p>
              <p>Today</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button className="rounded-2xl border border-border p-4 text-left hover:border-primary transition">
              <p className="text-sm text-muted-foreground">Explore</p>
              <p className="font-semibold text-foreground">Browse new heritage items</p>
            </button>
            <button className="rounded-2xl border border-border p-4 text-left hover:border-primary transition">
              <p className="text-sm text-muted-foreground">AI Chat</p>
              <p className="font-semibold text-foreground">Ask about culture</p>
            </button>
            <button className="rounded-2xl border border-border p-4 text-left hover:border-primary transition">
              <p className="text-sm text-muted-foreground">Dashboard</p>
              <p className="font-semibold text-foreground">View progress</p>
            </button>
            <button className="rounded-2xl border border-border p-4 text-left hover:border-primary transition">
              <p className="text-sm text-muted-foreground">Bookmarks</p>
              <p className="font-semibold text-foreground">See saved items</p>
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
