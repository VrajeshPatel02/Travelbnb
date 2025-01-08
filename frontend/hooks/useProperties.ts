import { useState, useEffect, useCallback } from "react";
import { propertyService } from "@/services/propertyService";
import { Property } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertyList = await propertyService.getAllProperties(0);
        setProperties(propertyList);
      } catch (error) {
        toast({
            variant: "destructive",
          description: "Failed to fetch properties. Please try again later.",
        });
        console.error(
          "Error fetching properties:",
          error instanceof Error ? error.message : error
        );
      }
    };

    fetchProperties();
  }, [toast]);

  const toggleFavorite = useCallback(
    async (propertyId: number) => {
      try {
        const property = properties.find((prop) => prop.id === propertyId);
        if (property) {
          const updatedFavorite = !property.isFavorite;

          await propertyService.setFavorites({
            id: property.id,
            status: updatedFavorite,
          });

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

  return { properties, toggleFavorite };
};