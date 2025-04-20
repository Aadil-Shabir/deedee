"use client";
import { useState } from "react";
import { Pricing } from "../ui/promote/pricing";

export default function PromotePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // In a real application, you would redirect to checkout or sign up page
    console.log(`Selected plan: ${planId}`);
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slideIn">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-600 text-transparent bg-clip-text mb-6">
            Elevate Your Startup Journey
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Choose the perfect plan to accelerate your growth, connect with investors, 
            and turn your vision into reality.
          </p>
        </div>
        
        <div className="animate-slideIn" style={{ animationDelay: "150ms" }}>
          <Pricing onSelectPlan={handleSelectPlan} />
        </div>
        
        {selectedPlan && (
          <div className="mt-16 p-6 bg-zinc-900/70 backdrop-blur-md rounded-xl border border-violet-500/20 shadow-lg animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4 text-violet-300">
              Thank you for selecting our {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan!
            </h3>
            <p className="text-zinc-400">
              Our team will contact you shortly with next steps to get you started on your journey.
              In the meantime, feel free to explore our resources and prepare your questions.
            </p>
          </div>
        )}
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideIn" style={{ animationDelay: "300ms" }}>
          <div className="p-6 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-lg animate-float">
            <h3 className="text-xl font-semibold mb-3">Trusted by 500+ Startups</h3>
            <p className="text-zinc-400">Join hundreds of successful founders who took their startups to the next level with our guidance.</p>
          </div>
          
          <div className="p-6 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-lg animate-float" style={{ animationDelay: "150ms" }}>
            <h3 className="text-xl font-semibold mb-3">$100M+ Raised</h3>
            <p className="text-zinc-400">Our startups have collectively raised over $100 million in funding with our support.</p>
          </div>
          
          <div className="p-6 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 shadow-lg animate-float" style={{ animationDelay: "300ms" }}>
            <h3 className="text-xl font-semibold mb-3">Money-Back Guarantee</h3>
            <p className="text-zinc-400">Not satisfied with our service? Get a full refund within 14 days, no questions asked.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 