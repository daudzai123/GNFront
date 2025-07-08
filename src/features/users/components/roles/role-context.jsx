import { useContext, useState } from "react";
import { createContext } from "react";

const RoleContext = createContext();

const RoleProvider = ({ children }) => {
  const [role, setRole] = useState();

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

const useRoleContext = () => {
  return useContext(RoleContext);
};

export { useRoleContext, RoleProvider };
