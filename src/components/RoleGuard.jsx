import useAuth from "../hooks/useAuth";
import Forbidden from "./Forbidden";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Forbidden message="Please log in to access this page" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Forbidden message="You don't have permission to access this page" />;
  }

  return children;
};

export default RoleGuard;