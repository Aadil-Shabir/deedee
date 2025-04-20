import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function FastTrack() {
  return (
    <div className="w-full py-10">
      <h2 className="text-3xl font-bold text-white mb-12">Fast Track Your Funding & Work With Us</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-zinc-900 rounded-lg overflow-hidden">
          <div className="relative aspect-video bg-black/30 flex items-center justify-center cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-red-600/90 flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-white ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
            <img 
              src="/images/video-placeholder.jpg" 
              alt="Get Investment Ready in 60-90 Days" 
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-bold text-violet-500 mb-6">DealMaker Pro</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Personal funding advisor assigned to your case</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Custom pitch deck review and optimization</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Direct introductions to pre-qualified investors</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Fundraising strategy development workshop</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Term sheet negotiation support</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Weekly progress meetings with funding team</span>
            </div>
            
            <div className="mt-8">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 