import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5133/api',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Session expired. Please log in again.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
