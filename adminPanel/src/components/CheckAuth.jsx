import axios from 'axios';

export const checkAuth = async () => {
    let isAuthenticated = false
    try {
        const response = await axios.get( `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/check-auth`, { withCredentials: true });
        if (response.status === 200) {
            return isAuthenticated = true // Return authentication status
        }
        
        
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
};