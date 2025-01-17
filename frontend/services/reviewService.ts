import { Review } from '@/types/property';
import api from './authService';
import {handleApiError} from './errorHandler';
class ReviewService {
    async getPropertyReviews(propertyId: number): Promise<Review[]> {
        try {
          const response = await api.get<Review[]>(`/reviews/PropertyReviews?propertyId=${propertyId}`);
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }

}
export const reviewService = new ReviewService();