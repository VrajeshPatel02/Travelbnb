import { useState, useCallback, useEffect } from "react";
import { propertyService } from "@/services/propertyService";
import { Property } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

export const useProperty = (propertyId: number) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch a single property by its ID
  const fetchProperty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: Property = await propertyService.getPropertyById(propertyId);
      setProperty(response);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch property details. Please try again later.",
      });
      console.error("Error fetching property:", error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, toast]);

  // Toggle favorites for the property
  const toggleFavorite = useCallback(async () => {
    if (!property) {
      toast({
        variant: "destructive",
        description: "Property not found. Please refresh the page and try again.",
      });
      return;
    }

    try {
      const { favouriteDto } = property;

      // Determine whether to create or update the favorite
      const isCreateRequest = favouriteDto?.id === 0; // If `id` is 0, make a POST request
      const updatedFavorite = !favouriteDto.status;

      if (isCreateRequest) {
        // Make POST request
        await propertyService.setFavorites({
          id: property.id,
          status: updatedFavorite,
        });
      } else {
        // Make UPDATE request
        await propertyService.updateFavorites(favouriteDto.id);
      }

      toast({
        description: updatedFavorite
          ? "Saved to Favourites."
          : "Removed from Favourites.",
      });

      // Update state
      setProperty((prevProp) =>
        prevProp ? { ...prevProp, favouriteDto: { ...prevProp.favouriteDto, status: updatedFavorite } } : null
      );
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update favorite status. Please try again.",
      });
      console.error(
        "Failed to update favorite:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }, [property, toast]);

  // Fetch property details on mount or when propertyId changes
  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return { property, toggleFavorite, isLoading };
};
