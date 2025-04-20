import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';

export function ReviewsSection() {
  return (
    <div className="w-full py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-white">Reviews</h1>
        
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20">
            <Heart className="h-5 w-5 text-pink-500" fill="currentColor" />
          </Button>
          
          <Button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2">
            Invest Now
          </Button>
        </div>
      </div>
      
      <div className="bg-zinc-900/60 rounded-lg p-12">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">No reviews yet</h2>
          
          <p className="text-lg text-zinc-400 mb-8">
            You have not received any recommendations yet. Invite partners, clients, or advisors to leave a recommendation for your company.
          </p>
          
          <Button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-6">
            Request Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
} 