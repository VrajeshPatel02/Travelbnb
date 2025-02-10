import { Button } from '@/components/ui/button';
import { reviewService } from '@/services/reviewService';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ReviewFormProps {
  propertyId: number;
  onReviewAdded: () => void; // Callback to refresh reviews
}

const ReviewForm: React.FC<ReviewFormProps> = ({ propertyId, onReviewAdded }) => {
  const [rating, setRating] = useState<number>(1);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting review:', { rating, description });
    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5');
      return;
    }
    if (!description.trim()) {
      toast.error('Description cannot be empty');
      return;
    }
    try {
      await reviewService.addReview({ rating, description }, propertyId);
      toast.success('Review added successfully!');
      onReviewAdded(); // Call the function passed from the parent
      setRating(1);
      setDescription('');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows={3}
          placeholder="Write your review..."
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
};

export default ReviewForm;