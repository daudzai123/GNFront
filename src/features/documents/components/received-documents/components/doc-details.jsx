import { useTranslation } from "react-i18next";
import { BiCommentDetail } from "react-icons/bi";
import { englishToPersianDigits } from "../../../../../components/convert-digits";

const DocumentDetails = ({ data }) => {
  const { t } = useTranslation();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Convert Date
  const convertDate = (dateString) => {
    return new Date(dateString)
      .toLocaleDateString("fa-Persian", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        calendar: "islamic-umalqura",
      })
      .replace(/\//g, "-");
  };
  const convertedSendingDate = convertDate(data.sendingDate);
  const convertedSeenDate = convertDate(data.timeToSeen);

  // View Document File
  const getDocument = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="card" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="card-body">
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">{t("shared.docNum")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {englishToPersianDigits(data.documentId?.docNumber)}
            </strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">{t("shared.subject")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>{englishToPersianDigits(data.documentId?.subject)}</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">
            {t("shared.sendingDate")}
          </div>
          <div className="col-lg-9 col-md-8">
            <strong>{convertedSendingDate}</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">{t("shared.secrecy")}</div>
          <div className="col-lg-9 col-md-8">
            <span
              className={
                data.secret === "SECRET"
                  ? "badge bg-danger"
                  : "badge bg-primary"
              }
            >
              {data.secret === "SECRET"
                ? t("shared.secret")
                : t("shared.nonSecret")}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">
            {t("shared.sendingStatus")}
          </div>
          <div className="col-lg-9 col-md-8">
            <span
              className={
                data.sendingStatus === "PENDING"
                  ? "badge bg-warning"
                  : "badge bg-success"
              }
            >
              {data.sendingStatus === "PENDING"
                ? t("shared.pending")
                : t("shared.seen")}
            </span>
            {data.sendingStatus !== "PENDING" && (
              <strong className="ml-2 me-2">{convertedSeenDate}</strong>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">{t("shared.guide")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>{data.guide}</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">
            {t("shared.docStatus")}
          </div>
          <div className="col-lg-9 col-md-8">
            <span
              className={
                data.docStatus === "TODO"
                  ? "badge bg-primary"
                  : data.docStatus === "IN_PROGRESS"
                  ? "badge bg-info"
                  : data.docStatus === "IN_COMPLETE"
                  ? "badge bg-warning"
                  : data.docStatus === "DONE"
                  ? "badge bg-success"
                  : data.docStatus === "VIOLATION"
                  ? "badge bg-danger"
                  : ""
              }
            >
              {data.docStatus === "TODO"
                ? t("mainLayout.dashboard.todo")
                : data.docStatus === "IN_PROGRESS"
                ? t("mainLayout.dashboard.inprogress")
                : data.docStatus === "IN_COMPLETE"
                ? t("mainLayout.dashboard.incomplete")
                : data.docStatus === "DONE"
                ? t("mainLayout.dashboard.done")
                : data.docStatus === "VIOLATION"
                ? t("mainLayout.dashboard.violation")
                : ""}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">{t("shared.sender")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>{data.senderDepartment?.depName}</strong>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-4 label">{t("shared.docType")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.documentId?.docType === "MAKTOOB"
                ? t("filter.maktoob")
                : data.documentId?.docType === "FARMAN"
                ? t("filter.farman")
                : data.documentId?.docType === "MUSAWWIBA"
                ? t("filter.musawiba")
                : data.documentId?.docType === "HIDAYAT"
                ? t("filter.hidayat")
                : data.documentId?.docType === "HUKAM"
                ? t("filter.hukam")
                : t("filter.report")}
            </strong>
          </div>
        </div>
        <div className="mt-5">
          {data.documentId?.downloadUrl !== null && (
            <button
              className="btn btn-lg btn-info"
              onClick={() =>
                getDocument(`${BASE_URL}${data.documentId?.downloadUrl}`)
              }
            >
              <BiCommentDetail className="mx-1" />
              {t("shared.viewDoc")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
