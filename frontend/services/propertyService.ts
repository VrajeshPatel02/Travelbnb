import api from './authService';
import axios from 'axios';
import { FavoritesRequest, FavoritesResponse, PropertyApiResponse, ApiResponse, Property, PaginatedProperties } from "@/types/property";
import {handleApiError} from './errorHandler';

class PropertyService {
  async setFavorites(property: FavoritesRequest): Promise<ApiResponse<FavoritesResponse>> {
    try {
      const response = await api.post(`/favourite/myfavourites?propertyId=${property.id}`, property);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  
  async getAllProperties(pageNo: number): Promise<PaginatedProperties> {
  try {
    const response = await api.get<PropertyApiResponse>(`/property/allProperties?pageNo=${pageNo}`);
    console.log(response.data);

    if (!response.data?._embedded?.propertyDtoList) {
      throw new Error("Invalid API response structure");
    }

    return {
      properties: response.data._embedded.propertyDtoList,
      totalPages: response.data.page.totalPages,
      currentPage: response.data.page.number,
    };
  } catch (error) {
    handleApiError(error);
    return { properties: [], totalPages: 0, currentPage: 0 }; // Return empty values on error
  }
}

  async searchProperties(name: string): Promise<Property[]> {
    try {
      const response = await api.post<Property[]>(`/search/properties?name=${name}`)
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}
export const propertyService = new PropertyService();