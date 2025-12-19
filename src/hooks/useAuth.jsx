import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Corrected path assumption: assuming axios instance is in src/api/axios.js(x)
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

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
        localStorage.removeItem("token");
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
      localStorage.removeItem("token");
      return null;
    }
  };

  // Function to fetch full user data from API
  const fetchFullUser = async (token) => {
    try {
      // Set token in Axios Header
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await API.get("/me");

      // Normalize response: some APIs return { user: {...} }, others return the user object directly
      const fetchedUser = res.data?.user ?? res.data;
      setUser(fetchedUser);
      setIsAuthenticated(true);
      setLoading(false);
      return fetchedUser;
    } catch (error) {
      console.error("Failed to fetch full user data:", error);
      // Logout if token is invalid or fetching fails
      handleLogout();
      setLoading(false);
      return null;
    }
  };
  // Initialize state on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
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
  const handleLogin = async (token, redirectPath = "/") => {
    localStorage.setItem("token", token);
    const decodedUser = decodeUserFromToken(token);

    if (!decodedUser) {
      handleLogout();
      return null;
    }

    // Fetch full user data after setting token and wait for it to complete
    const fetchedUser = await fetchFullUser(token);
    toast.success("Login successful!");

    // If caller passed `false`, skip automatic navigation (but user is now set)
    if (redirectPath === false) return fetchedUser;

    // If caller provided a specific redirect path, use it
    if (typeof redirectPath === "string" && redirectPath !== "/") {
      navigate(redirectPath, { replace: true });
      return fetchedUser;
    }

    // Redirect based on role (default behavior) using fetched user
    const role = fetchedUser?.role ?? decodedUser.role;
    if (role === "admin") {
      navigate("/dashboard/admin", { replace: true });
    } else if (role === "decorator") {
      navigate("/dashboard/decorator-dashboard", { replace: true });
    } else {
      navigate("/", { replace: true }); // Home page for regular users
    }

    return fetchedUser;
  };

  // Logout Handler (hoisted function so it can be used earlier)
  function handleLogout() {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Logged out successfully.");
    navigate("/login");
  }

  // Value provided by the Context
  const value = {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refetchUser: () => {
      const token = localStorage.getItem("token");
      if (token) fetchFullUser(token);
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading authentication...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom Hook useAuth (default export)
const useAuth = () => {
  return useContext(AuthContext);
};

// Export AuthProvider and set useAuth as default export
export default useAuth;
