"use client";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { KitchenList } from "@/components/home/KitchenList";
import { BottomNav } from "@/components/layout/BottomNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <Header />
      <Hero />
      <div className="pt-8">
        <ServiceGrid />
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-2 bg-muted/50 w-full mb-6 rounded-full" /> {/* Divider */}
        </div>
        <KitchenList />
      </div>
      <BottomNav />
    </main>
  );
}
