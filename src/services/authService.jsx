// src/services/authService.jsx
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import

// Get the API URL from environment variables
const apiUrl = process.env.REACT_APP_API_URL;

// Function to check if the token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token); // Use jwtDecode here
    return decoded.exp * 1000 < Date.now(); // Token expiration is in seconds, so we multiply by 1000 to compare with current timestamp
};

// Function to refresh the access token using the refresh token from cookies
const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshTokenFromCookie();
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${apiUrl}/accessToken`, { refreshToken });
        const { accessToken } = response.data;

        // Store the new access token in memory (e.g., in a variable or context)
        setAccessTokenInMemory(accessToken);
        saveRolesFromToken(accessToken);

        return accessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Handle the case where token refresh fails (you may want to logout the user)
        logout(); // Clear the tokens
        return null; // Return null if refresh fails
    }
};

// Function to get the access token stored in memory
const getAccessTokenFromMemory = () => {
    return localStorage.getItem('accessToken');
};

// Function to set the access token in memory (could be in state or context)
const setAccessTokenInMemory = (token) => {
    // You could store this in a global state or in memory (localStorage can still be used for session persistence)
    localStorage.setItem('accessToken', token); // For simplicity, still using localStorage for access token
};

// Function to get refresh token from cookies
const getRefreshTokenFromCookie = () => {
    const matches = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
    return matches ? decodeURIComponent(matches[1]) : null;
};

// Axios request interceptor to add the Authorization header
const addAuthHeaders = (config) => {
    const token = getAccessTokenFromMemory();
    if (token && !isTokenExpired(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

// Axios response interceptor to handle token renewal
const handleTokenRefresh = async (error) => {
    if (error.response && error.response.status === 401) {
        // If the token is expired (401 Unauthorized), try to refresh the token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            // Retry the original request with the new access token
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(error.config); // Retry original request
        }
    }
    return Promise.reject(error);
};

// Function to set up Axios interceptors
const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(addAuthHeaders, (error) => Promise.reject(error));
    axios.interceptors.response.use((response) => response, handleTokenRefresh);
};

// Function to handle login
const login = async (username, password) => {
    try {
        const response = await axios.post(`${apiUrl}/login`, { UserName: username, Password: password }, { withCredentials: true });
        const { accessToken } = response.data;

        // Store the access token in memory (localStorage for simplicity)
        setAccessTokenInMemory(accessToken);

        // Save roles from the decoded token
        saveRolesFromToken(accessToken);

        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

// Function to handle logout
const logout = () => {
    // Remove the access token from memory
    localStorage.removeItem('accessToken');

    // Remove roles
    clearRoles();

    // Remove the refresh token cookie
    //document.cookie = 'refreshToken=; path=/; Max-Age=0'; // Expire the refresh token cookie
};
// Function to decode JWT and extract roles
const decodeToken = (token) => {
    try {
        return jwtDecode(token); // Assuming you have jwt-decode library installed
    } catch (e) {
        console.error("Failed to decode token", e);
        return null;
    }
};

const saveRolesFromToken = (token) => {
    const decoded = decodeToken(token);

    const rolesClaim = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : [];

    const roles = Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim];

    localStorage.setItem('roles', JSON.stringify(roles));
};

// Retrieve roles
const getRoles = () => {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
};

// Clear roles (on logout)
const clearRoles = () => {
    localStorage.removeItem('roles');
};

// Function to check if a user has a specific role
const hasRole = (role) => {
    const roles = getRoles();
    return roles.includes(role);
};

export { saveRolesFromToken, getRoles, clearRoles, hasRole, setupAxiosInterceptors, refreshAccessToken, isTokenExpired, login, logout };
