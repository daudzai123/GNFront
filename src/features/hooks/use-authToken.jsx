import { useContext } from "react";
import AuthTokenContext from "../../contexts/auth/authToken-context";

const useAuthToken = () => {
  return useContext(AuthTokenContext);
};

export default useAuthToken;
