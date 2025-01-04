import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import TechnologyStacks from "@/components/landing/TechnologyStacks";
import Partners from "@/components/landing/Partners";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      <Navbar />
      <main className="mt-16"> {/* Changed from pt-24 to mt-16 for consistency */}
        <Hero />
        <Features />
        <Stats />
        <TechnologyStacks />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;