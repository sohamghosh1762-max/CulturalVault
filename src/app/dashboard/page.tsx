"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ItemGrid } from "@/components/cards/ItemGrid";
import { useItems } from "@/hooks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";

export default function DashboardPage() {
  // Simulate fetching user's saved items or quick history
  const { items, loading, error } = useItems({}, 1);
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-background overflow-hidden bg-primary shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" 
                alt="User Avatar" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="mb-2 drop-shadow-md">
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
                {greeting}, User!
              </h1>
              <p className="text-muted-foreground mt-1">Cultural Explorer • Joined just now</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Dashboard Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Items Explored", value: "142" },
            { label: "Collections", value: "4" },
            { label: "Contributions", value: "0" },
            { label: "Curator Rank", value: "Novice" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="glass p-6 rounded-2xl border border-white/5"
            >
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommended or Saved Items Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
            <p className="text-muted-foreground">Based on your recent explorations</p>
          </div>
          <Link href="/explore" className="px-5 py-2 border border-border hover:bg-muted text-sm font-medium rounded-xl transition-colors">
            Explore All
          </Link>
        </div>

        <ItemGrid items={items.slice(0, 4)} loading={loading} error={error} />
      </motion.section>
    </PageWrapper>
  );
}
