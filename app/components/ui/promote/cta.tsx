import Link from "next/link";

export function CTA() {
  return (
    <div className="w-full py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 to-transparent" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-violet-500/20 blur-xl animate-float" style={{ animationDelay: "0ms" }} />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-pink-500/20 blur-xl animate-float" style={{ animationDelay: "700ms" }} />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-pink-400 text-transparent bg-clip-text">
          Ready to Accelerate Your Fundraising?
        </h2>
        
        <p className="text-zinc-300 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of founders who have successfully raised capital using our platform. Get matched with the right investors, perfect your pitch, and close your round faster.
        </p>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-glow"></div>
          <Link 
            href="/auth/signup" 
            className="relative bg-zinc-900 px-8 py-4 rounded-lg text-white font-medium inline-block shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300"
          >
            Start Your Free Trial
          </Link>
        </div>
        
        <p className="text-zinc-400 text-sm mt-4">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </div>
  );
} 