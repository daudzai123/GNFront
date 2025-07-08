import { createContext, useState } from "react";

const AuthTokenContext = createContext({});

export const AuthTokenProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  return (
    <AuthTokenContext.Provider
      value={{ authToken, setAuthToken, persist, setPersist }}
    >
      {children}
    </AuthTokenContext.Provider>
  );
};

export default AuthTokenContext;
