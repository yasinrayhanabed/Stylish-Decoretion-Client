import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Corrected path assumption: assuming axios instance is in src/api/axios.js(x)
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// 1. Context Creation and Export
export const AuthContext = createContext(null);

// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to decode user data from token
    const decodeUserFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            // Token expiry check
            if (decoded.exp * 1000 < Date.now()) {
                console.log("Token expired.");
                localStorage.removeItem('token');
                return null;
            }
            // Return essential data from token
            return {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name,
            };
        } catch (error) {
            console.error("Failed to decode token:", error);
            localStorage.removeItem('token');
            return null;
        }
    };

    // Function to fetch full user data from API
    const fetchFullUser = async (token) => {
        try {
            // Set token in Axios Header
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await API.get('/me'); 
            
            setUser(res.data);
            setIsAuthenticated(true);
            
        } catch (error) {
            console.error("Failed to fetch full user data:", error);
            // Logout if token is invalid or fetching fails
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    // Initialize state on first load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = decodeUserFromToken(token);
            if (decodedUser) {
                // Token is valid, now fetch full data
                fetchFullUser(token);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []); 

    // Login Handler
    const handleLogin = (token, redirectPath = '/dashboard/user') => {
        localStorage.setItem('token', token);
        const decodedUser = decodeUserFromToken(token);
        
        if (decodedUser) {
            // Fetch full user data after setting token
            fetchFullUser(token);
            toast.success("Login successful!");
            
            // Redirect based on role
            if (decodedUser.role === 'admin') {
                navigate('/dashboard/manage-services', { replace: true });
            } else if (decodedUser.role === 'decorator') {
                navigate('/dashboard/decorator', { replace: true });
            } else {
                navigate(redirectPath, { replace: true });
            }
        } else {
            // If token cannot be decoded
            handleLogout();
        }
    };

    // Logout Handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        delete API.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        toast.info("Logged out successfully.");
        navigate('/login');
    };

    // Value provided by the Context
    const value = {
        user,
        isAuthenticated,
        loading,
        login: handleLogin,
        logout: handleLogout,
        refetchUser: () => {
            const token = localStorage.getItem('token');
            if(token) fetchFullUser(token);
        },
    };

    if (loading) {
        return <div className='flex justify-center items-center min-h-screen text-xl'>Loading authentication...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom Hook useAuth (default export)
const useAuth = () => {
    return useContext(AuthContext);
};

// Export AuthProvider and set useAuth as default export
export default useAuth;