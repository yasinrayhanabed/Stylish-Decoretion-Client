import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import Spinner from "../components/Spinner";
import Forbidden from "../components/Forbidden";

const PrivateRoute = ({ requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Spinner />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && requiredRole.length > 0) {
        const userRole = user.role?.toLowerCase();

        if (!requiredRole.map(role => role.toLowerCase()).includes(userRole)) {
            return <Forbidden />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;