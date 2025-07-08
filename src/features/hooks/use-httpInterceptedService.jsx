import { useEffect } from "react";
import { httpInterceptedService } from "../../core/http-service";
import useRefreshToken from "./use-refreshToken";
import useAuthToken from "./use-authToken";

const useHttpInterceptedService = () => {
  const refresh = useRefreshToken();
  const { authToken } = useAuthToken();

  useEffect(() => {
    const requestIntercept = httpInterceptedService.interceptors.request.use(
      (config) => {
        if (!config.headers[`Authorization`]) {
          config.headers["Authorization"] = `Bearer ${authToken?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = httpInterceptedService.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return httpInterceptedService(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      httpInterceptedService.interceptors.request.eject(requestIntercept);
      httpInterceptedService.interceptors.response.eject(responseIntercept);
    };
  }, [authToken, refresh]);

  return httpInterceptedService;
};

export default useHttpInterceptedService;
