import api, { authService } from './authService';

export const userService = {
  async getUserProfile() {
    try {
      const response = await api.get('/user/travelUser', {
        params: { userId: authService.getUser()?.id }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile', error);
      throw error;
    }
  }
};