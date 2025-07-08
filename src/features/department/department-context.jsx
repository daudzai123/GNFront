import { useContext, useState } from "react";
import { createContext } from "react";

const DepartmentContext = createContext();

const DepartmentProvider = ({ children }) => {
  const [department, setDepartment] = useState();

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};

const useDepartmentContext = () => {
  return useContext(DepartmentContext);
};

export { useDepartmentContext, DepartmentProvider };
