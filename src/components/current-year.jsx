import { useTranslation } from "react-i18next";

function CurrentYear() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <p className="mb-0" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <span>{t("systemOwner")}</span> - {currentYear}{" "}
        <a href="#" className="text-muted">
          MCIT
        </a>{" "}
        ©
      </p>
    </>
  );
}

export default CurrentYear;
