export interface Property {
  id: number;
  name: string;
  noGuests: number;
  no_bedrooms: number;
  no_bathrooms: number;
  price: number;
  country: number;
  location: number;
  description: string;
  imageUrl: string[];
  avgRating: number;
  isFavorite: boolean;
}

export interface PropertyApiResponse {
  _embedded: {
    propertyDtoList: Property[]; 
  };
  page: {
    size: number; 
    totalElements: number;
    totalPages: number; 
    number: number; 
  };
}

export interface PaginatedProperties {
  properties: Property[];
  totalPages: number;
  currentPage: number;
}

export interface FavoritesRequest {
  id: number; 
  status: boolean; 
}

export interface FavoritesResponse {
  id: number; 
  status: boolean;
  property: number;
  user: number; 
}

export interface ApiResponse<T> {
  data: T; 
  message: string; 
  status: number; 
}