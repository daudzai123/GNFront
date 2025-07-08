import useAuth from "./use-auth";
import useAuthToken from "./use-authToken";
import useHttpInterceptedService from "./use-httpInterceptedService";

const useLogout = () => {
  const { setAuth } = useAuth();
  const { setAuthToken, setPersist } = useAuthToken();
  const httpInterceptedService = useHttpInterceptedService();

  const logout = async () => {
    setAuth({});
    setAuthToken({});
    setPersist(false);
    localStorage.removeItem("auth");
    try {
      const response = await httpInterceptedService.post("/auth/logout");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return logout;
};

export default useLogout;
