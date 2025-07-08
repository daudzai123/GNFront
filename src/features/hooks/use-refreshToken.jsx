import { toast } from "react-toastify";
import { httpService } from "../../core/http-service";
import useAuthToken from "./use-authToken";
import useAuth from "./use-auth";
import { useTranslation } from "react-i18next";

const useRefreshToken = () => {
  const { t } = useTranslation();
  const { setAuthToken } = useAuthToken();
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await httpService.get("/auth/refresh-token", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setAuthToken((prev) => {
        return {
          ...prev,
          roles: response.data.roles,
          accessToken: response.data.access_token,
        };
      });
      return response.data.access_token;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setAuth({});
        setAuthToken({});
        localStorage.removeItem("auth");
        toast.error(t("toast.expiredToken"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
