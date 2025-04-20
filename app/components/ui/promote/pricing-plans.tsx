import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export function PricingPlans() {
  return (
    <div className="w-full py-10">
      <h2 className="text-3xl font-bold text-white mb-8">3 Ways to Promote Your Deal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
          <div className="text-3xl font-bold text-violet-500 mb-4">$99/month</div>
          
          <div className="text-violet-400 font-medium mb-4">Basic Access for Beginners</div>
          
          <p className="text-zinc-400 mb-6">
            💡 For founders who want to test the waters but will need more traction to secure funding.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Max outreach 150 p/m</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-zinc-300">DeeDee profile Verification Badge</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Basic profile visibility</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Limited investor matching (only within their category)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Standard analytics (views, clicks, and basic engagement)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Email support</span>
            </div>
            
            <div className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-500">No direct investor outreach</span>
            </div>
            
            <div className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-500">No priority placement in investor dashboards</span>
            </div>
            
            <div className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-500">No personalized promotion</span>
            </div>
          </div>
        </div>
        
        {/* Founder+ Plan */}
        <div className="bg-zinc-900 rounded-lg border border-violet-700 p-6 shadow-md shadow-violet-900/30 hover:shadow-lg hover:shadow-violet-900/40 transition-shadow duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Founder+</h3>
          <div className="text-3xl font-bold text-violet-500 mb-4">$199/month</div>
          
          <div className="text-violet-400 font-medium mb-4">Fast-Track to Investor Matching</div>
          
          <p className="text-zinc-400 mb-6">
            💡 For founders serious about funding who need priority matching and hands-on support.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Max outreach 250 p/m</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-zinc-300">DeeDee Profile Verification Badge</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Enhanced profile visibility</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Priority investor matching (Access to a wider, more engaged investor pool)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Advanced analytics dashboard (Investor activity insights)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Priority email & chat support</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Monthly strategy call with an investor specialist</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Included in DeeDee's Investor Newsletter for wider exposure</span>
            </div>
          </div>
        </div>
        
        {/* Dealmaker Plan */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Dealmaker</h3>
          <div className="text-3xl font-bold text-violet-500 mb-4">$499/month</div>
          
          <div className="text-violet-400 font-medium mb-4">The Fast-Track Funding Engine 🚀</div>
          
          <p className="text-zinc-400 mb-6">
            💡 For founders who want to raise money ASAP and get maximum exposure to investors.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Max Outreach unlimited</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-zinc-300">DeeDee Profile Verification Badge</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Maximum profile visibility (Top of investor dashboards)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">VIP investor matching</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Real-time analytics & insights (Who's viewing, engaging, and interested)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">24/7 dedicated support (Direct response team for fundraising)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Weekly strategy calls (Investor outreach planning)</span>
            </div>
            
            <div className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-300">Custom marketing campaign (Social media & PR push to investors)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 