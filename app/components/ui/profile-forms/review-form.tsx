import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Send, UserPlus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useCompanyContext } from "@/context/company-context";

// Sample placeholder reviews for demonstration
const PLACEHOLDER_REVIEWS = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Smith",
    type: "Client",
    content: "Working with this team was an absolute pleasure. They delivered the project on time and exceeded our expectations.",
    date: "Mar 15, 2025",
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=Jane Smith`
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Johnson",
    type: "Investor",
    content: "I've seen many startups in this space, but this company's approach to solving customer problems is genuinely innovative. Their growth metrics speak for themselves.",
    date: "Mar 10, 2025",
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=Michael Johnson`
  }
];

export const CompanyReviews = ({onComplete}: {onComplete?: () => void}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { activeCompanyId } = useCompanyContext();
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  // Simulate loading and then show placeholders
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowPlaceholders(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRequestRecommendations = () => {
    toast.success("Recommendation request has been sent!");
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleShareReviews = () => {
    navigator.clipboard.writeText(`Check out the reviews for our company: https://deedee.ai/company/reviews`);
    toast.success("Review link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
          Testimonials & Reviews
        </h1>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleShareReviews}
            className="border-violet-700/50 bg-violet-900/20 hover:bg-violet-700/30 hover:border-violet-600 text-violet-300 transition-colors"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button 
            onClick={handleRequestRecommendations}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Request Review
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-lg p-6 border border-zinc-700/40 shadow-md">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-zinc-800 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 w-40 mb-2 bg-zinc-800 animate-pulse rounded"></div>
                  <div className="h-4 w-20 bg-zinc-800 animate-pulse rounded"></div>
                </div>
                <div className="h-8 w-20 bg-zinc-800 animate-pulse rounded"></div>
              </div>
              <div className="h-24 w-full mt-6 bg-zinc-800 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && showPlaceholders && (
        <Card className="bg-transparent border-none shadow-none">
          <div className="space-y-4">
            {PLACEHOLDER_REVIEWS.map((review) => (
              <div key={review.id} className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-lg p-6 border border-zinc-700/40 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-violet-900/30 flex items-center justify-center">
                      <img src={review.avatarUrl} alt={`${review.firstName} ${review.lastName}`} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {review.firstName} {review.lastName}
                      </h3>
                      <p className="text-zinc-400">{review.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end">
                    <span className="text-zinc-400 mr-4 sm:mr-0 sm:mb-2">{review.date}</span>
                    <button 
                      className="text-zinc-500 hover:text-pink-400 transition-colors"
                      onClick={() => toast.success(`You liked ${review.firstName}'s review!`)}
                    >
                      <Heart className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 text-zinc-300 text-lg italic">
                  {review.content}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!isLoading && !showPlaceholders && (
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-xl p-8 text-center border border-zinc-700/40 shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-violet-900/20 rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-violet-300" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-200 mb-2">No reviews yet</h3>
          <p className="text-zinc-400 max-w-md mx-auto">
            You have not received any recommendations yet. Invite partners, clients, 
            or advisors to leave a recommendation for your company.
          </p>
          <Button 
            className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200"
            onClick={handleRequestRecommendations}
          >
            <Send className="mr-2 h-4 w-4" />
            Request Recommendations
          </Button>
        </div>
      )}
      
      <div className="mt-12 bg-violet-500/10 backdrop-blur-sm rounded-xl p-6 border border-violet-700/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-white mb-1">
            Want more testimonials?
          </h3>
          <p className="text-zinc-300">
            Invite your clients and partners to share their experience.
          </p>
        </div>
        <Button 
          onClick={handleRequestRecommendations}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md transition-all duration-200 w-full sm:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Request New Review
        </Button>
      </div>
    </div>
  );
};
