import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReactPlayer from "react-player";
import { ArrowRight, Check } from "lucide-react";

export function PremiumServices() {
  return (
    <div className="mt-12">
      <Separator className="mb-8 bg-zinc-700/50" />
      <h2 className="text-2xl font-semibold text-center mb-8">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
          Fast Track Your Funding & Work With Us
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8 bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-zinc-700/40">
        {/* Video Column */}
        <div className="flex flex-col items-center justify-center rounded-lg overflow-hidden bg-black/60 shadow-inner border border-zinc-700/40">
          <ReactPlayer 
            url="https://www.youtube.com/watch?v=isWl1ApzN18" 
            width="100%" 
            height="100%" 
            controls
            className="aspect-video"
          />
        </div>
        
        {/* DealMaker Pro Column */}
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300 mb-4">
            DealMaker Pro
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <span>Personal funding advisor assigned to your case</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <span>Custom pitch deck review and optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <span>Direct introductions to pre-qualified investors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <span>Fundraising strategy development workshop</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <span>Term sheet negotiation support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <span>Weekly progress meetings with funding team</span>
            </li>
          </ul>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200 md:w-1/2 flex items-center gap-2">
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
