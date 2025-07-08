import emptyFolder from "@assets/images/emptyFolder.jpeg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { FaRegFileAlt } from "react-icons/fa";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { useTranslation } from "react-i18next";
import { IoIosAdd } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { ConfirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";
import NewLinkedDocuments from "./add-linked-documents";
import useAuthToken from "../../../hooks/use-authToken";

const LinkedDocuments = ({ docId }) => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const navigate = useNavigate();
  const httpInterceptedService = useHttpInterceptedService();
  const [linkedDocuments, setLinkedDocuments] = useState([]);
  const [isLinkingUpdated, setIsLinkingUpdated] = useState(Date.now());
  const [showAddLinking, setShowAddLinking] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const fetchLinking = async () => {
    try {
      const response = await httpInterceptedService.get(
        `/document/linkings/${docId}`
      );
      setLinkedDocuments(response.data);
    } catch (error) {
      console.error("Error fetching linked documents:", error);
    }
  };
  useEffect(() => {
    fetchLinking();
  }, [docId, isLinkingUpdated]);

  const handleUpdateLinking = () => {
    setIsLinkingUpdated(Date.now());
  };

  // Confirm Delete
  const confirmDelete = (event, docId) => {
    event.preventDefault();
    setSelectedDocId(docId);
    setConfirmationVisible(true);
  };

  const acceptConfirmation = async (docId) => {
    try {
      const response = await httpInterceptedService.delete(
        `/linking/delete/${docId}`
      );
      if (response.status === 200) {
        setLinkedDocuments(linkedDocuments.filter((doc) => doc.id !== docId));
        toast.success(t("toast.linkedDocDeleteSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } else {
        toast.error(t("toast.linkedDocDeleteFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } catch (error) {
      console.error("Error removing linked document:", error);
    } finally {
      setConfirmationVisible(false);
    }
  };

  const rejectConfirmation = () => {
    setConfirmationVisible(false);
  };

  const handleNavigation = (docId) => {
    navigate(`/documents/${docId}`);
  };

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          {showAddLinking && (
            <NewLinkedDocuments
              docId={docId}
              setIsLinkingUpdated={handleUpdateLinking}
              showAddLinking={showAddLinking}
              setShowAddLinking={setShowAddLinking}
            />
          )}
          <ConfirmDialog
            visible={confirmationVisible}
            onHide={() => setConfirmationVisible(false)}
            message={
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="pi pi-info-circle"
                  style={{ marginLeft: "8px", fontSize: "1.5em" }}
                ></i>
                {t("shared.linkedDocConfirmDelete")}
              </div>
            }
            header={t("shared.deleteConfirmation")}
            position="top"
            style={{ width: "30vw" }}
            breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
            acceptClassName="p-button-danger"
            acceptLabel={t("document.documentGrid.yes")}
            rejectLabel={t("document.documentGrid.no")}
            accept={() => acceptConfirmation(selectedDocId)}
            reject={rejectConfirmation}
          />
          <div className="card">
            <div className="card-header bg-dark d-flex justify-content-between">
              <h3 className="text-light">{t("shared.linkedDoc")}</h3>
              {authToken?.roles.includes("add_linked_documents") && (
                <button
                  onClick={() => setShowAddLinking(true)}
                  className="btn btn-primary fw-bolder mt-n1"
                >
                  <IoIosAdd size={25} />
                  {t("shared.newLinkedDoc")}
                </button>
              )}
            </div>
            <div className="card-body" style={{ overflowX: "auto" }}>
              <table className="table table-striped">
                <thead className="font-weight-bold">
                  <tr>
                    <th>{t("shared.docNum")}</th>
                    <th>{t("shared.docNumLeader")}</th>
                    <th>{t("shared.subject")}</th>
                    <th>{t("shared.docType")}</th>
                    <th>{t("shared.reference")}</th>
                    <th>{t("shared.leaderDate")}</th>
                    <th>{t("shared.initialDate")}</th>
                    <th>{t("shared.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedDocuments && linkedDocuments.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: "center" }}>
                        <div className="empty-result">
                          <img src={emptyFolder} alt="Not Found" width={100} />
                          <p className="alert-warning text-center">
                            {t("logs.emptyList")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    linkedDocuments.map((document) => {
                      const convertedInitialDate = new Date(
                        document.initialDate
                      )
                        .toLocaleTimeString("fa-Persian", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          calendar: "islamic-umalqura",
                        })
                        .replace(/\//g, "-");
                      const convertedSecondDate = document.secondDate
                        ? new Date(document.secondDate)
                            .toLocaleDateString("fa-Persian", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              calendar: "islamic-umalqura",
                            })
                            .replace(/\//g, "-")
                        : null;

                      return (
                        <tr key={document.docId}>
                          <td>{document.docNumber}</td>
                          <td>
                            {document.docNumber2 ? document.docNumber2 : "-"}
                          </td>
                          <td>{document.subject}</td>
                          <td>
                            {document.docType === "HUKAM"
                              ? t("filter.hukam")
                              : document.docType === "HIDAYAT"
                              ? t("filter.hidayat")
                              : document.docType === "FARMAN"
                              ? t("filter.farman")
                              : document.docType === "MUSAWWIBA"
                              ? t("filter.musawiba")
                              : document.docType}
                          </td>
                          <td>
                            {document.referenceType === "AMIR"
                              ? t("filter.leader")
                              : document.referenceType === "RAYESULWOZARA"
                              ? t("filter.rayesulwozara")
                              : document.referenceType === "KABINA"
                              ? t("filter.kabina")
                              : document.referenceType === null
                              ? "-"
                              : document.referenceType}
                          </td>
                          <td>
                            {convertedSecondDate !== null
                              ? convertedSecondDate
                              : "-"}
                          </td>
                          <td>{convertedInitialDate}</td>
                          <td className="table-action">
                            <Tooltip
                              target=".custom-view-btn"
                              content={t("shared.details")}
                              position="top"
                            />
                            <Link
                              onClick={() =>
                                handleNavigation(
                                  document.ownerDep
                                    ? document.docId
                                    : document.sendDocId
                                )
                              }
                            >
                              <FaRegFileAlt
                                size={30}
                                className="custom-view-btn"
                              />
                            </Link>
                            <Tooltip
                              target=".delete-icon"
                              content={t("shared.delete")}
                              position="top"
                            />
                            {authToken?.roles.includes(
                              "delete_linked_documents"
                            ) && (
                              <Link
                                onClick={(e) =>
                                  confirmDelete(e, document.docId)
                                }
                              >
                                <IoIosRemoveCircle
                                  size={30}
                                  className="delete-icon"
                                />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkedDocuments;
