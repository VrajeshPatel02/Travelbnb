import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/user'; // replace with your API's base URL

const axiosConfig = axios.create({
    baseURL: BASE_URL,
});

export default axiosConfig;

// Add a request interceptor to include the access token in every request
axiosConfig.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh on 401 errors
axiosConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/refreshToken`, { refreshToken });
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    // Handle refresh token failure (e.g., logout the user)
                }
            }
        }

        return Promise.reject(error);
    }
);
