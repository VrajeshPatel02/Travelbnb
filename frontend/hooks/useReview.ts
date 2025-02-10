import { reviewService } from '@/services/reviewService';
import { Review } from '@/types/property';
import { useCallback, useEffect, useState } from 'react';

export const usePropertyReviews = (propertyId: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPropertyReviews = useCallback(async () => {
    if (!propertyId) {
      setMessage('Invalid property ID. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const fetchedReviews = await reviewService.getPropertyReviews(propertyId);

      if (fetchedReviews.length > 0) {
        setReviews(fetchedReviews);
        setMessage(null);
      } else {
        setMessage('No reviews yet for this property.');
      }
    } catch (error) {
      setMessage('Failed to fetch reviews. Please try again later.');
      console.error('Error fetching reviews:', error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchPropertyReviews();
  }, [fetchPropertyReviews]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(2)
    : '0.00';

  return { 
    reviews, 
    isLoading, 
    message, 
    fetchPropertyReviews, 
    averageRating: Number(averageRating), 
    totalReviews: reviews.length 
  };
};
