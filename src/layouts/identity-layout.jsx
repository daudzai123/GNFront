import { Outlet } from "react-router-dom";
import ChangeLanguage from "../components/change-language";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import bk from "@assets/images/bk.png";

const IdentityLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="main d-flex justify-content-center w-100"
        style={{
          minHeight: '40vh',
          backgroundImage: `url(${bk})`, // ✅ Corrected
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          fontFamily: "'Yakan', 'Lalezar', sans-serif",
        }}
      >
        {/* Uncomment and adjust the navbar if needed */}
        {/* <nav className="navbar shadow-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <ChangeLanguage />
          </div>
          <h1 className="h1" style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', flex: 2 }}>
            {t("title")}
          </h1>
        </nav> */}

        <main className="content d-flex p-0">
          <div className="container d-flex flex-column">
            <div className="row h-100">
              <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div className="d-table-cell align-middle">
                  <Suspense fallback={<p className="text-info">{t("shared.loading")}</p>}>
                    <Outlet />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default IdentityLayout;
