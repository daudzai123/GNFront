import { useTranslation } from "react-i18next";
import pdfIcon from "@assets/images/pdf.jpeg";
import excelIcon from "@assets/images/excel.jpeg";
import wordIcon from "@assets/images/word.jpeg";
import textIcon from "@assets/images/text.jpeg";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import unknownIcon from "@assets/images/unknown.jpeg";
import { AiOutlineDelete } from "react-icons/ai";
import { CiFileOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import useAuthToken from "../../../hooks/use-authToken";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { useRef } from "react";

const Appendants = ({ data, handleUpdate }) => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const httpInterceptedService = useHttpInterceptedService();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const fileUploadRef = useRef(null);

  // Upload
  const onUpload = async (event) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await httpInterceptedService.post(
        
        `/document/addAppendantDoc/${data.docId}`,
        formData
      );

      if (response.status === 200) {
        toast.success(t("toast.fileUploadSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        handleUpdate();
        fileUploadRef.current.clear();
      } else {
        toast.error(t("toast.fileUploadFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(t("toast.fileUploadError"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  // Delete
  const accept = async (appendantDocId) => {
    try {
      const response = await httpInterceptedService.delete(
        `/document/removeAppendantDoc/${data.docId}/${appendantDocId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(t("toast.fileDeleteSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        handleUpdate();
      } else {
        toast.error(t("toast.fileDeleteFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(t("toast.fileDeleteError"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  const confirmDelete = (event, appendantDocId) => {
    confirmPopup({
      target: event.currentTarget,
      message: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="pi pi-info-circle"
            style={{ marginLeft: "8px", fontSize: "1.5em" }}
          ></i>
          {t("document.documentGrid.confirmDelete")}
        </div>
      ),
      acceptClassName: "p-button-danger",
      acceptLabel: t("document.documentGrid.yes"),
      rejectLabel: t("document.documentGrid.no"),
      accept: () => accept(appendantDocId),
    });
  };

  // View Document File
  const getDocument = (url) => {
    window.open(url, "_blank");
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  return (
    <>
      <div className="d-flex flex-column" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        {authToken?.roles.includes("add_append") && (
          <div className="d-flex justify-content-end">
            <FileUpload
              ref={fileUploadRef}
              mode="basic"
              name="file"
              customUpload
              uploadHandler={onUpload}
              accept=".pdf,.doc,.docx, image/*,.xls,.xlsx,.txt"
              maxFileSize={1000000}
              chooseLabel={t("shared.addAppendant")}
            />
          </div>
        )}
        <div className="card" style={{ overflowX: "auto" }}>
          <div className="card-body d-flex flex-row">
            <ConfirmPopup />
            {data.appendantDocsList?.map((append) => {
              const fileExtension = getFileExtension(append.appendantDocName);
              return (
                <div
                  key={append.appendantDocId}
                  className="mx-3 d-flex flex-column justify-content-center align-items-center"
                >
                  {fileExtension === "jpg" ||
                  fileExtension === "jpeg" ||
                  fileExtension === "png" ? (
                    <>
                      <img
                        src={`${BASE_URL}${append.appendantDocDownloadUrl}`}
                        alt={append.appendantDocName}
                        height={80}
                        width={80}
                      />

                      {append.appendantDocName}
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip
                          target=".view-icon"
                          content={t("shared.viewDoc")}
                          position="bottom"
                        />

                        <Link
                          className="badge bg-primary"
                          onClick={() =>
                            getDocument(
                              `${BASE_URL}${append.appendantDocDownloadUrl}`
                            )
                          }
                        >
                          <CiFileOn size={20} className="view-icon" />
                        </Link>
                        <Tooltip
                          target=".delete-icon"
                          content={t("shared.delete")}
                          position="bottom"
                        />
                        {authToken?.roles.includes("delete_append") && (
                          <Link
                            className="badge bg-danger"
                            onClick={(e) =>
                              confirmDelete(e, append.appendantDocId)
                            }
                          >
                            <AiOutlineDelete
                              size={20}
                              className="delete-icon"
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : fileExtension === "pdf" ? (
                    <>
                      <img src={pdfIcon} alt="PDF" height={80} width={80} />
                      {append.appendantDocName}
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip
                          target=".view-icon"
                          content={t("shared.viewDoc")}
                          position="bottom"
                        />
                        <Link
                          className="view-icon badge bg-primary"
                          onClick={() =>
                            getDocument(
                              `${BASE_URL}${append.appendantDocDownloadUrl}`
                            )
                          }
                        >
                          <CiFileOn size={20} className="view-icon" />
                        </Link>
                        <Tooltip
                          target=".delete-icon"
                          content={t("shared.delete")}
                          position="bottom"
                        />
                        {authToken?.roles.includes("delete_append") && (
                          <Link
                            className="badge bg-danger"
                            onClick={(e) =>
                              confirmDelete(e, append.appendantDocId)
                            }
                          >
                            <AiOutlineDelete
                              size={20}
                              className="delete-icon"
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : fileExtension === "xlsx" || fileExtension === "xls" ? (
                    <>
                      <img src={excelIcon} alt="Excel" height={80} width={80} />

                      {append.appendantDocName}
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip
                          target=".download-icon"
                          content={t("shared.download")}
                          position="bottom"
                        />
                        <Link
                          className="badge bg-primary"
                          onClick={() =>
                            getDocument(
                              `${BASE_URL}${append.appendantDocDownloadUrl}`
                            )
                          }
                        >
                          <CiFileOn size={20} className="download-icon" />
                        </Link>
                        <Tooltip
                          target=".delete-icon"
                          content={t("shared.delete")}
                          position="bottom"
                        />
                        {authToken?.roles.includes("delete_append") && (
                          <Link
                            className="badge bg-danger"
                            onClick={(e) =>
                              confirmDelete(e, append.appendantDocId)
                            }
                          >
                            <AiOutlineDelete
                              size={20}
                              className="delete-icon"
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : fileExtension === "doc" || fileExtension === "docx" ? (
                    <>
                      <img src={wordIcon} alt="Word" height={80} width={80} />

                      {append.appendantDocName}
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip
                          target=".download-icon"
                          content={t("shared.download")}
                          position="bottom"
                        />
                        <Link
                          className="badge bg-primary"
                          onClick={() =>
                            getDocument(
                              `${BASE_URL}${append.appendantDocDownloadUrl}`
                            )
                          }
                        >
                          <CiFileOn size={20} className="download-icon" />
                        </Link>
                        <Tooltip
                          target=".delete-icon"
                          content={t("shared.delete")}
                          position="bottom"
                        />
                        {authToken?.roles.includes("delete_append") && (
                          <Link
                            className="badge bg-danger"
                            onClick={(e) =>
                              confirmDelete(e, append.appendantDocId)
                            }
                          >
                            <AiOutlineDelete
                              size={20}
                              className="delete-icon"
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : fileExtension === "txt" ? (
                    <>
                      <img src={textIcon} alt="Text" height={80} width={80} />

                      {append.appendantDocName}
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip
                          target=".download-icon"
                          content={t("shared.download")}
                          position="bottom"
                        />
                        <Link
                          className="badge bg-primary"
                          onClick={() =>
                            getDocument(
                              `${BASE_URL}${append.appendantDocDownloadUrl}`
                            )
                          }
                        >
                          <CiFileOn size={20} className="download-icon" />
                        </Link>
                        <Tooltip
                          target=".delete-icon"
                          content={t("shared.delete")}
                          position="bottom"
                        />
                        {authToken?.roles.includes("delete_append") && (
                          <Link
                            className="badge bg-danger"
                            onClick={(e) =>
                              confirmDelete(e, append.appendantDocId)
                            }
                          >
                            <AiOutlineDelete
                              size={20}
                              className="delete-icon"
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={unknownIcon}
                        alt="Text Icon"
                        height={80}
                        width={80}
                      />
                      {append.appendantDocName}
                      <div className="d-flex justify-content-center gap-2">
                        <Tooltip
                          target=".download-icon"
                          content={t("shared.download")}
                          position="bottom"
                        />
                        <Link
                          onClick={() =>
                            getDocument(
                              `${BASE_URL}${append.appendantDocDownloadUrl}`
                            )
                          }
                          className="badge bg-primary"
                        >
                          <CiFileOn size={20} className="download-icon" />
                        </Link>
                        <Tooltip
                          target=".delete-icon"
                          content={t("shared.delete")}
                          position="bottom"
                        />
                        {authToken?.roles.includes("delete_append") && (
                          <Link
                            className="badge bg-danger"
                            onClick={(e) =>
                              confirmDelete(e, append.appendantDocId)
                            }
                          >
                            <AiOutlineDelete
                              size={20}
                              className="delete-icon"
                            />
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appendants;
