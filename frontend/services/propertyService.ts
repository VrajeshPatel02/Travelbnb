import api from './authService';
import axios from 'axios';
import { FavoritesRequest, FavoritesResponse, PropertyApiResponse, ApiResponse, Property } from "@/types/property";
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

  async getAllProperties(pageNo: number): Promise<Property[]> {

    try {
      // Fetching data with explicit response type
      const response = await api.get<PropertyApiResponse>(`/property/allProperties?pageNo=${pageNo}`);
      console.log(response.data)
      // Validate API structure
      if (!response.data?._embedded?.propertyDtoList) {
        throw new Error("Invalid API response structure");
      }

      // Extract properties from the response
      return response.data._embedded.propertyDtoList;
    } catch (error) {
      return handleApiError(error);
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