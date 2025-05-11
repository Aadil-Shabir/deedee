import { Heart } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ReviewItemProps {
  firstName: string;
  lastName: string;
  type: string;
  content: string;
  date: string;
  avatarUrl?: string;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  firstName,
  lastName,
  type,
  content,
  date,
  avatarUrl,
}) => {
  const [liked, setLiked] = useState(false);
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  
  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Review unliked" : `You liked ${firstName}'s review!`);
  };
  
  return (
    <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-lg p-6 border border-zinc-700/40 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <Avatar className="h-16 w-16 border border-violet-700/30">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
            ) : (
              <AvatarFallback className="bg-violet-900/30 text-white font-bold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-xl font-bold text-white">{firstName} {lastName}</h3>
            <p className="text-zinc-400">{type}</p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:flex-col sm:items-end">
          <span className="text-zinc-400 mr-4 sm:mr-0 sm:mb-2">{date}</span>
          <button 
            className={cn(
              "transition-colors",
              liked ? "text-pink-500" : "text-zinc-500 hover:text-pink-400"
            )}
            onClick={handleLike}
          >
            <Heart className={cn(
              "h-6 w-6",
              liked ? "fill-pink-500" : ""
            )} />
          </button>
        </div>
      </div>
      <div className="mt-6 text-zinc-300 text-lg italic">
        {content}
      </div>
    </div>
  );
};
