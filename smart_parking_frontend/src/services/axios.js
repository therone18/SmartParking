import axios from 'axios';

const baseURL = 'https://smartparking-c9yn.onrender.com'; 

const axiosInstance = axios.create({
  baseURL: "https://smartparking-c9yn.onrender.com",
  withCredentials: true,
});

// Request: Attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: Handle expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: localStorage.getItem('refresh'),
        });

        localStorage.setItem('access', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token expired or invalid');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
