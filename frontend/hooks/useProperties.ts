import { useState, useEffect, useCallback } from "react";
import { propertyService } from "@/services/propertyService";
import { Property } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

interface PropertyServiceResponse {
  properties: Property[];
  totalPages: number;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialProperties = async () => {
      setIsLoading(true);
      try {
        const response: PropertyServiceResponse = await propertyService.getAllProperties(0);
        const { properties: initialProperties, totalPages } = response;
        setProperties(initialProperties);
        setTotalPages(totalPages);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to fetch properties. Please try again later.",
        });
        console.error("Error fetching properties:", error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialProperties();
  }, [toast]);

  const loadMoreProperties = useCallback(async () => {
    if (isLoading || currentPage >= totalPages - 1) {
      return;
    }

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response: PropertyServiceResponse = await propertyService.getAllProperties(nextPage);
      const { properties: newProperties } = response;
      setProperties((prevProps) => [...prevProps, ...newProperties]);
      setCurrentPage(nextPage);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to load more properties. Please try again later.",
      });
      console.error("Error loading more properties:", error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, currentPage, totalPages, toast]);

  const toggleFavorite = useCallback(
    async (propertyId: number) => {
      try {
        const property = properties.find((prop) => prop.id === propertyId);
  
        if (property) {
          const { favouriteDto } = property;
  
          // Determine whether to create or update the favorite
          const isCreateRequest = favouriteDto?.id === 0; // If `id` is 0, make a POST request
  
          const updatedFavorite = !property.favouriteDto.status;
  
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
          setProperties((prevProps) =>
            prevProps.map((prop) =>
              prop.id === propertyId
                ? { ...prop, isFavorite: updatedFavorite }
                : prop
            )
          );
        }
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
    },
    [properties, toast]
  );
  
  return { properties, loadMoreProperties, toggleFavorite, hasMore: currentPage < totalPages - 1, isLoading };
};
