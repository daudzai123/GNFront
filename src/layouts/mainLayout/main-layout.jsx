import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { Suspense } from "react";
import CurrentYear from "../../components/current-year";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const { t } = useTranslation();
  return (
    <div className="wrapper" style={{ minHeight: "100vh" , fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className="content">
          <div className="container-fluid p-0">
            <Suspense
              fallback={
                <p className="text-info">{t("shared.informationLoading")}</p>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <CurrentYear />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
