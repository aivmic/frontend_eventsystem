import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
};

const getAccessTokenFromMemory = () => {
    return localStorage.getItem('accessToken');
};

const setAccessTokenInMemory = (token) => {
    localStorage.setItem('accessToken', token);
};

const getRefreshTokenFromCookie = () => {
    const matches = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
    return matches ? decodeURIComponent(matches[1]) : null;
};

const refreshAccessToken = async () => {
    const refreshToken = getRefreshTokenFromCookie();
    if (!refreshToken) {
        console.log("No refresh token found");
        return null;
    }

    try {
        const response = await axios.post(`${apiUrl}/accessToken`, { refreshToken });
        const { accessToken } = response.data;
        setAccessTokenInMemory(accessToken);
        return accessToken;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        logout();
        return null;
    }
};

const addAuthHeaders = (config) => {
    const token = getAccessTokenFromMemory();
    if (token && !isTokenExpired(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

const handleTokenRefresh = async (error) => {
    if (error.response && error.response.status === 401) {
        console.log('401 Unauthorized, attempting to refresh token...');
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            console.log('Token refreshed successfully');
            error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(error.config);
        } else {
            console.log('Failed to refresh token, logging out...');
            logout();
        }
    }
    return Promise.reject(error);
};

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(addAuthHeaders, (error) => Promise.reject(error));
    axios.interceptors.response.use((response) => response, handleTokenRefresh);
};

const login = async (username, password) => {
    try {
        const response = await axios.post(`${apiUrl}/login`, { UserName: username, Password: password }, { withCredentials: true });
        const { accessToken, refreshToken } = response.data;

        setAccessTokenInMemory(accessToken);
        document.cookie = `RefreshToken=${refreshToken}; Secure; SameSite=None; path=/`;

        saveRolesFromToken(accessToken);

        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('accessToken');
    //document.cookie = 'RefreshToken =; expires = Thu, 01 Jan 1970 00:00:00 GMT';

    clearRoles();
};

const decodeToken = (token) => {
    try {
        return jwtDecode(token);
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

export {
    saveRolesFromToken,
    getRoles,
    clearRoles,
    hasRole,
    setupAxiosInterceptors,
    isTokenExpired,
    login,
    logout,
    refreshAccessToken
};
