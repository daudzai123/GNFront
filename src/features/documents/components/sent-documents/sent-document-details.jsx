import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TreeTrackDocument from "./tree-track-document";
import { Accordion, AccordionTab } from "primereact/accordion";
import PrimeReactBreadCrumb from "../../../../components/BreadCrumb";
import LinkedDocuments from "../linked-documents/linked-document-list";
import ReportList from "../reports/report-list";
import Loading from "../../../../components/loading";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import UpdateSendDoc from "./components/update-send-doc";
import Appendants from "./components/appendants";
import DocumentDetails from "./components/doc-details";
import Comments from "../comments/comments";
import useAuthToken from "../../../hooks/use-authToken";

const SentDocumentDetails = () => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const [toogleState, setToogleState] = useState(1);
  const { id } = useParams();
  const toogleTab = (index) => {
    setToogleState(index);
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateKey, setUpdateKey] = useState(Date.now());
  const [reports, setReports] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const httpInterceptedService = useHttpInterceptedService();

  const fetchData = async () => {
    try {
      const response = await httpInterceptedService.get(
        `/sendDocument/getSentDocbyId/${id}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching sent document details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [updateKey]);
  const handleUpdate = () => {
    setUpdateKey(Date.now());
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await httpInterceptedService.get(
          "/department/AllDropDownDepartment"
        );

        if (response.data) {
          const options = response.data.map((department) => ({
            value: department.depId,
            label: department.depName,
          }));
          setDepartmentOptions(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch Reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const updatedReports = await httpInterceptedService.get(
          `/DocumentReport/getReportBySendDocId/${id}`
        );
        setReports(updatedReports.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReports();
  }, [id]);

  return (
    <>
      {loading ? (
        <Loading theme="primary" />
      ) : (
        <>
          <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
            <div className="col-xl-12">
              <div className="mb-2">
                <PrimeReactBreadCrumb
                  first={t("mainLayout.sidebar.home")}
                  firstUrl={"/"}
                  second={t("document.sentDocuments.sentDocumentsList")}
                  secondUrl={"/outgoing-documents"}
                  last={t("document.sentDocuments.sentDocumentsDetails")}
                />
              </div>
              <div className="card">
                <div className="card-body pt-3">
                  <div className="blac-tabs">
                    <ul className="nav nav-tabs nav-tabs-bordered">
                      <li className="nav-item">
                        <button
                          className={
                            toogleState === 1
                              ? "nav-link active-tabs"
                              : "nav-link"
                          }
                          onClick={() => toogleTab(1)}
                          data-bs-toggle="tab"
                          data-bs-target="#document-details"
                        >
                          {t("shared.details")}
                        </button>
                      </li>
                      {authToken?.roles.includes("sendDoc_update") && (
                        <li className="nav-item">
                          <button
                            className={
                              toogleState === 2
                                ? "nav-link active-tabs"
                                : "nav-link"
                            }
                            onClick={() => toogleTab(2)}
                            data-bs-toggle="tab"
                            data-bs-target="#send-document-update"
                          >
                            {t("shared.edit")}
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="content-tabs">
                    <div
                      className={
                        toogleState === 1
                          ? "content-tab active-content-tab"
                          : "content-tab"
                      }
                      id="document-details"
                    >
                      <DocumentDetails data={data} />
                    </div>
                    <div
                      className={
                        toogleState === 2
                          ? "content-tab active-content-tab"
                          : "content-tab"
                      }
                      id="send-document-update"
                    >
                      <UpdateSendDoc
                        data={data}
                        id={id}
                        departmentOptions={departmentOptions}
                        handleUpdate={handleUpdate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <Accordion multiple activeIndex={0}>
                    <AccordionTab header={t("shared.appendants")}>
                      <Appendants data={data} />
                    </AccordionTab>
                    {authToken?.roles.includes("view_document_tracking") && (
                      <AccordionTab header={t("shared.trackDoc")}>
                        <TreeTrackDocument />
                      </AccordionTab>
                    )}
                    {authToken?.roles.includes("view_linked_documents") && (
                      <AccordionTab header={t("shared.linkedDoc")}>
                        <LinkedDocuments docId={data.documentId?.docId} />
                      </AccordionTab>
                    )}
                    {authToken?.roles.includes("report_view") && (
                      <AccordionTab header={t("shared.reports")}>
                        <ReportList reports={reports} />
                      </AccordionTab>
                    )}
                    {authToken?.roles.includes("comment_view") && (
                      <AccordionTab header={t("shared.comments")}>
                        <Comments id={id} />
                      </AccordionTab>
                    )}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SentDocumentDetails;
