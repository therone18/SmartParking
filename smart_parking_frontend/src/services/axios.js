import axios from 'axios';

const baseURL = 'https://smartparking-c9yn.onrender.com';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Request: Attach access token
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('access_token'); // ✅ FIXED
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token') // ✅ FIXED
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: localStorage.getItem('refresh_token'), // ✅ FIXED
        });

        localStorage.setItem('access_token', res.data.access); // ✅ FIXED
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token expired or invalid');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
