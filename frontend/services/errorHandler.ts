import axios from "axios";

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
  throw new Error("An unexpected error occurred");
};
