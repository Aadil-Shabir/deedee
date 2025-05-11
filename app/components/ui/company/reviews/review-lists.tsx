import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { ReviewItem } from "./review-item";

interface Review {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  content: string;
  date: string;
  avatarUrl?: string;
}

interface ReviewsListProps {
  reviews: Review[];
  isLoading: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/70 rounded-lg p-6 border border-zinc-700/40 shadow-md">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-24 w-full mt-6" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // We'll handle the empty state in the parent component
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          firstName={review.firstName}
          lastName={review.lastName}
          type={review.type}
          content={review.content}
          date={review.date}
          avatarUrl={review.avatarUrl}
        />
      ))}
    </div>
  );
};
