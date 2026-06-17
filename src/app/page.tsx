"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background relative overflow-hidden flex flex-col justify-center items-center">
      {/* Immersive background image with glassy gradient overlays */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <Image 
          src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=2000&q=80" 
          alt="Landing Background" 
          fill 
          className="object-cover opacity-25 mix-blend-luminosity duration-[20s] hover:scale-110 transition-transform"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background z-10" />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md">
          <p className="text-secondary-foreground text-sm font-semibold tracking-wider uppercase">
            World Heritage Explorer
          </p>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-8">
          Preserve the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">World's Heritage</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed">
          Discover, collect, and curate the most stunning art forms, ancient traditions, and marvelous historical architectures across human history.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.7)] hover:-translate-y-1"
          >
            Join the Registry
          </Link>
          <Link 
            href="/explore" 
            className="px-10 py-4 glass text-foreground font-semibold rounded-2xl hover:bg-white/10 transition-all border border-white/10 hover:-translate-y-1"
          >
            Explore Library
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Decorative blurred shapes behind content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 blur-[150px] rounded-full pointer-events-none translate-x-1/2 z-0" 
      />
    </main>
  );
}
