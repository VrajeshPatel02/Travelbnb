import { Review } from '@/types/property';
import api from './authService';
import { handleApiError } from './errorHandler';

class ReviewService {
    async getPropertyReviews(propertyId: number): Promise<Review[]> {
        try {
          const response = await api.get<Review[]>(`/reviews/PropertyReviews?propertyId=${propertyId}`);
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }

    async addReview(reviewData: { rating: number; description: string }, propertyId: number): Promise<void> {
        console.log('Adding review:', { reviewData, propertyId });
        await api.post(`/reviews/addReview?propertyId=${propertyId}`, reviewData);
    }
}

export const reviewService = new ReviewService();