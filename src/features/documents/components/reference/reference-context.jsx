import { useContext, useState } from "react";
import { createContext } from "react";

const ReferenceContext = createContext();

const ReferenceProvider = ({ children }) => {
  const [reference, setReference] = useState();

  return (
    <ReferenceContext.Provider value={{ reference, setReference }}>
      {children}
    </ReferenceContext.Provider>
  );
};

const useReferenceContext = () => {
  return useContext(ReferenceContext);
};

export { useReferenceContext, ReferenceProvider };
