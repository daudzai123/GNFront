import { Tooltip } from "primereact/tooltip";
import useAxios from "@core/useAxios";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import { Link } from "react-router-dom";
import Loading from "../../../../components/loading";
import { useTranslation } from "react-i18next";

const NewReceivedDocuments = () => {
  const { t } = useTranslation();
  const [newReceivedDocuments, , loading] = useAxios({
    url: "/sendDocument/getReceivedDocumentsBySendingStatus/PENDING",
  });

  const renderContent = () => {
    if (loading) {
      return <Loading theme="primary" />;
    }

    return (
      <>
        {/* <div className="card">
          <div className="card-header bg-dark">
            <h3 className="text-light">
              {t("document.receivedDocuments.receivedDocumentsList")}
            </h3>
          </div>
          <div className="card-body" style={{ overflowX: "auto" }}>
            <table className="table table-striped">
              <thead className="font-weight-bold">
                <tr>
                  <th>{t("shared.subject")}</th>
                  <th>{t("shared.sender")}</th>
                  <th>{t("shared.receivedDate")}</th>
                  <th>{t("shared.secrecy")}</th>
                  <th>{t("shared.sendingStatus")}</th>
                  <th>{t("shared.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {newReceivedDocuments && newReceivedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      <div className="empty-result">
                        <img src={emptyFolder} alt="Not Found" width={100} />
                        <p className="alert-warning text-center">
                          {t("document.receivedDocuments.emptyList")}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  newReceivedDocuments.map((document) => {
                    const convertedSendingDate = new Date(document.sendingDate)
                      .toLocaleTimeString("fa-Persian", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        calendar: "islamic-umalqura",
                      })
                      .replace(/\//g, "-");
                    return (
                      <tr key={document.sendDocId}>
                        <td>{document.subject}</td>
                        <td>{document.senderDepartment.depName}</td>
                        <td>{convertedSendingDate}</td>
                        <td>
                          <span
                            className={
                              document.secret === "SECRET"
                                ? "badge bg-danger"
                                : "badge bg-primary"
                            }
                          >
                            {document.secret === "SECRET"
                              ? t("shared.secret")
                              : t("shared.nonSecret")}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              document.sendingStatus === "PENDING"
                                ? "badge bg-warning"
                                : "badge bg-success"
                            }
                          >
                            {document.sendingStatus === "PENDING"
                              ? t("shared.pending")
                              : t("shared.seen")}
                          </span>
                        </td>
                        <td className="table-action">
                          <Tooltip
                            target=".custom-view-details"
                            content={t("shared.details")}
                            position="top"
                          />
                          <Link
                            to={`/incoming-documents/${document.sendDocId}`}
                            className="ms-3"
                          >
                            <HiOutlineClipboardDocumentList
                              size={30}
                              className="custom-view-details"
                            />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div> */}
      </>
    );
  };

  return (
    <>
      <div className="row" style={{ height: "auto" }}>
        <div className="col-12">{renderContent()}</div>
      </div>
    </>
  );
};

export default NewReceivedDocuments;
