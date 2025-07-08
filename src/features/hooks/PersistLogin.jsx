import { useEffect, useState } from "react";
import useRefreshToken from "./use-refreshToken";
import useAuthToken from "./use-authToken";
import Loading from "../../components/loading";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { authToken, persist } = useAuthToken();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        if (persist) {
          await refresh();
        }
      } catch (error) {
        console.error(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !authToken?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    return () => (isMounted = false);
  }, []);

  return <>{!persist ? <Outlet /> : isLoading ? <Loading /> : <Outlet />}</>;
};

export default PersistLogin;
