import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthToken from "../features/hooks/use-authToken";

const RequireAuth = ({ allowedRoles }) => {
  const { authToken } = useAuthToken();
  const location = useLocation();

  return authToken?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : authToken?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default RequireAuth;
