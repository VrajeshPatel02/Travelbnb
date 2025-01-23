import React, { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Review } from '@/types/property';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReviewSectionProps {
  reviews: Review[];
  isLoading: boolean;
  message?: string | null;
  avgRating: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  reviews, 
  isLoading, 
  message, 
  avgRating 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-rose-500 text-rose-500' : 'text-gray-300'}`} 
      />
    ));
  };

  if (isLoading) {
    return <p className="text-center">Loading reviews...</p>;
  }

  if (message) {
    return <p className="text-center text-gray-500">{message}</p>;
  }

  // Take first 6 reviews to display initially
  const displayedReviews = reviews.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Overall Rating */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Star className="w-6 h-6 fill-rose-500 text-rose-500" />
          <span className="text-2xl font-bold">{avgRating.toFixed(2)}</span>
        </div>
        <span className="text-gray-500">·</span>
        <span className="text-lg font-semibold">{reviews.length} reviews</span>
      </div>

      {/* Review Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="space-y-4 border-b pb-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage 
                  src={review.user.profilePicture || "/placeholder-avatar.jpg"} 
                  alt={review.user.name} 
                />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{review.user.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700 line-clamp-3">{review.description}</p>
          </div>
        ))}
      </div>

      {/* Show All Reviews Button */}
      {reviews.length > 6 && (
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
          >
            Show all {reviews.length} reviews
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Full Reviews Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center space-x-4">
                <Star className="w-6 h-6 fill-rose-500 text-rose-500" />
                <span>{avgRating.toFixed(2)} · {reviews.length} reviews</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-4 border-b pb-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage 
                      src={review.user.profilePicture || "/placeholder-avatar.jpg"} 
                      alt={review.user.name} 
                    />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{review.user.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.description}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewSection;