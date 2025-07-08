import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import useAuth from "../features/hooks/use-auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import useAuthToken from "../features/hooks/use-authToken";

const UnhandledException = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const routeError = useRouteError();
  const { setAuth } = useAuth();
  const { setAuthToken } = useAuthToken();
  useEffect(() => {
    if (
      routeError &&
      routeError.response?.status === 403 &&
      routeError.response?.data ===
        "Full authentication is required to access this resource!"
    ) {
      setAuth({});
      setAuthToken({});
      localStorage.removeItem("auth");
      toast.error(t("login.error.fullAuthenticationRequired"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      navigate("/login");
    } else if (
      routeError &&
      routeError.response?.status === 403 &&
      routeError.response?.data?.message ===
        "You dont have permission to access this endpoint!"
    ) {
      navigate("/unauthorized");
    }
  }, []);
  return (
    <div className="main d-flex justify-content-center w-100" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <main className="content d-flex p-0">
        <div className="container d-flex flex-column">
          <div className="row h-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center">
                  <h1 className="display-1 fw-bold text-info">Error</h1>
                  <p className="h2">{t("shared.serverError")}</p>
                  <p className="h4 fw-normal mt-3 mb-4">
                    {t("shared.serverErrorMessage")}
                  </p>
                  <button className="btn btn-info btn-lg ms-3" onClick={goBack}>
                    {t("shared.backPreviousPage")}
                  </button>
                  <Link to="/" className="btn btn-primary btn-lg">
                    {t("shared.backHomePage")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnhandledException;
