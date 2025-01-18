import { Property } from "@/types/property";
import api from "./authService";
import { handleApiError } from "./errorHandler";

class HostServie {
    async getHostProperties(): Promise<Property[]> {
        try {
          const response = await api.get<Property[]>(`/property/HostProperties`);
          return response.data;
        } catch (error) {
          return handleApiError(error);
        }
      }
}

export const hostService = new HostServie();