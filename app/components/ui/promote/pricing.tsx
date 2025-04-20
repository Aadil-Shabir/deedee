"use client";

import { Check } from "phosphor-react";
import { useState } from "react";

export function Pricing({onSelectPlan}: {onSelectPlan: (planId: string) => void}) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const tiers = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for early-stage startups just getting started with fundraising.",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Investor Discovery (Limited)",
        "Basic Analytics",
        "Pitch Deck Review",
        "Email Support",
        "1 User Account"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      id: "pro",
      name: "Professional",
      description: "For startups actively fundraising and needing advanced tools.",
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        "Unlimited Investor Matching",
        "Advanced Analytics Dashboard",
        "AI Pitch Optimization",
        "Deal Room Access",
        "Priority Support",
        "5 User Accounts"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Customized solutions for established startups with complex needs.",
      monthlyPrice: 199,
      annualPrice: 159,
      features: [
        "All Pro Features",
        "Custom Investor Targeting",
        "Dedicated Account Manager",
        "API Access",
        "Custom Integrations",
        "Unlimited User Accounts"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="w-full py-24 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-pink-400 text-transparent bg-clip-text">
            Simple, Transparent Pricing
          </h2>
          <p className="text-zinc-300 max-w-3xl mx-auto mb-10">
            Choose the plan that best fits your startups current stage and needs.
          </p>

          {/* Billing toggle */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-zinc-700 rounded-full p-1 transition-colors duration-300 focus:outline-none"
              aria-pressed={billingCycle === 'annual'}
            >
              <span 
                className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
                }`} 
              />
            </button>
            <div className="flex flex-col items-start">
              <span className={`text-sm ${billingCycle === 'annual' ? 'text-white' : 'text-zinc-400'}`}>Annual</span>
              <span className="text-xs text-violet-400">Save 20%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              className={`relative bg-zinc-900/70 backdrop-blur-sm rounded-xl p-8 border transition-all duration-300 ${
                tier.popular 
                  ? 'border-violet-500 shadow-lg shadow-violet-500/20' 
                  : hoveredTier === tier.id 
                    ? 'border-violet-500/50 shadow-lg' 
                    : 'border-zinc-800'
              }`}
              style={{ 
                animation: "slideIn 0.6s ease-out forwards",
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                transform: hoveredTier === tier.id ? 'translateY(-8px)' : 'translateY(0)'
              }}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full px-4 py-1">
                  <span className="text-xs font-medium text-white">Most Popular</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-zinc-400 mb-6 text-sm h-12">{tier.description}</p>
              
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                  </span>
                  <span className="text-zinc-400 ml-2">/month</span>
                </div>
                
                {billingCycle === 'annual' && (
                  <p className="text-xs text-violet-400 mt-1">
                    Billed annually (${tier.annualPrice * 12}/year)
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li 
                    key={featureIndex} 
                    className="flex items-start"
                    style={{ 
                      animation: "slideIn 0.3s ease-out forwards",
                      animationDelay: `${(index * 100) + (featureIndex * 50)}ms`,
                      opacity: hoveredTier === tier.id ? 1 : 0.9
                    }}
                  >
                    <Check size={20} className="text-violet-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onSelectPlan(tier.id)}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-500/30' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-zinc-400 mb-4">Need a custom solution?</p>
          <a href="#contact" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Contact our sales team to discuss your specific requirements
          </a>
        </div>
      </div>
    </div>
  );
} 