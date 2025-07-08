import { useState, useEffect } from "react";
import useHttpInterceptedService from "../features/hooks/use-httpInterceptedService";

const useAxios = (axiosParams) => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const httpInterceptedService = useHttpInterceptedService();

  const fetchData = async () => {
    try {
      const result = await httpInterceptedService.request(axiosParams);
      setResponse(result.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [axiosParams.url]);

  return [response, error, loading];
};

export default useAxios;
