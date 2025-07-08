import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const { t } = useTranslation();
  return (
    <div className="main d-flex justify-content-center w-100" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <main className="content d-flex p-0">
        <div className="container d-flex flex-column">
          <div className="row h-100">
            <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center">
                  <h1 className="display-1 fw-bold text-info">401</h1>
                  <p className="h2">{t("shared.unauthorized")}</p>
                  <p className="h4 fw-normal mt-3 mb-4">
                    {t("shared.unauthorizedMessage")}
                  </p>
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

export default Unauthorized;
