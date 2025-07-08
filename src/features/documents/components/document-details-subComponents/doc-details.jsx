import { useTranslation } from "react-i18next";
import { BiCommentDetail } from "react-icons/bi";
import { englishToPersianDigits } from "../../../../components/convert-digits";

const Details = ({ data }) => {
  const { t } = useTranslation();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Convert Dates
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

  const convertedInitialDate = convertDate(data.initialDate);
  const convertedReceivedDate = convertDate(data.receivedDate);
  const convertedCreationDate = convertDate(data.creationDate);
  const convertedDeadline = convertDate(data.deadline);
  const convertedSecondDate = data.secondDate
    ? convertDate(data.secondDate)
    : null;

  const convertedDocNum = englishToPersianDigits(data.docNumber);
  const convertedSubject = englishToPersianDigits(data.subject);

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
            <strong>{convertedDocNum}</strong>
          </div>
        </div>
        {(data.docType === "HUKAM" || data.docType === "HIDAYAT") &&
          data.referenceType === "AMIR" && (
            <div className="row">
              <div className="col-lg-3 col-md-4 label ">
                {t("shared.docNumLeader")}
              </div>
              <div className="col-lg-9 col-md-8">
                <strong>
                  {data.docNumber2
                    ? englishToPersianDigits(data.docNumber2)
                    : "-"}
                </strong>
              </div>
            </div>
          )}
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">{t("shared.subject")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>{convertedSubject}</strong>
          </div>
        </div>
        {data.secondDate && (
          <div className="row">
            <div className="col-lg-3 col-md-4 label">
              {t("shared.leaderDate")}
            </div>
            <div className="col-lg-9 col-md-8">
              <strong>{convertedSecondDate}</strong>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-lg-3 col-md-4 label">
            {t("shared.initialDate")}
          </div>
          <div className="col-lg-9 col-md-8">
            <strong>{convertedInitialDate}</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label">
            {t("shared.receivedDate")}
          </div>
          <div className="col-lg-9 col-md-8">
            <strong>{convertedReceivedDate}</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label">
            {t("shared.creationDate")}
          </div>
          <div className="col-lg-9 col-md-8">
            <strong>{convertedCreationDate}</strong>
          </div>
        </div>
        {data.executionType === "RESULT_BASE" && (
          <div className="row">
            <div className="col-lg-3 col-md-4 label">
              {t("shared.deadline")}
            </div>
            <div className="col-lg-9 col-md-8">
              <strong>{convertedDeadline}</strong>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-3 col-md-4 label">{t("backup.creator")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.userId?.firstName +
                " " +
                data.userId?.lastName +
                ", " +
                data.userId?.position}
            </strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label">{t("logs.department")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.userId?.department.map((dep) => (
                <div key={dep.depId}>{dep.depName} </div>
              ))}
            </strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label ">
            {t("shared.referenceImpl")}
          </div>
          <div className="col-lg-9 col-md-8">
            <strong>{data.reference ? data.reference?.refName : "-"}</strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label">
            {t("shared.executionType")}
          </div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.executionType === "CONTINUOUS"
                ? t("shared.continuous")
                : data.executionType === "INFORMATIVE"
                ? t("shared.informative")
                : t("shared.resultBased")}
            </strong>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-4 label">{t("shared.docType")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.docType === "MAKTOOB"
                ? t("filter.maktoob")
                : data.docType === "FARMAN"
                ? t("filter.farman")
                : data.docType === "MUSAWWIBA"
                ? t("filter.musawiba")
                : data.docType === "HIDAYAT"
                ? t("filter.hidayat")
                : data.docType === "HUKAM"
                ? t("filter.hukam")
                : t("filter.report")}
            </strong>
          </div>
        </div>

         {data.docType === "HUKAM" ||
        data.docType === "HIDAYAT" ||
        data.docType === "MUSAWWIBA" ? (
          <div className="row">
            <div className="col-lg-3 col-md-4 label ">
              {t("shared.reference")}
            </div>
            <div className="col-lg-9 col-md-8">
              <strong>
                {data.referenceType === "KABINA"
                  ? t("filter.kabina")
                  : data.referenceType === "AMIR"
                  ? t("filter.leader")
                  : data.referenceType === "RAYESULWOZARA"
                  ? t("filter.rayesulwozara")
                  : data.referenceType === "FINANCE_KABINA"
                  ? t("filter.economicKabina")
                  : data.referenceType}
              </strong>
            </div>
          </div>
        ) : null} 
        {data.description ? (
          <div className="row">
            <div className="col-lg-3 col-md-4 label">
              {t("shared.description")}
            </div>
            <div
              className="col-lg-9 col-md-8 border rounded p-2"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
        ) : null}

        <div className="mt-5">
          <button
            className="btn btn-lg btn-info"
            onClick={() => getDocument(`${BASE_URL}${data.downloadUrl}`)}
          >
            <BiCommentDetail className="mx-1" />
            {t("shared.viewDoc")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
