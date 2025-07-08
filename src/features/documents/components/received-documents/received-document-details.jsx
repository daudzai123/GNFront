import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/use-auth";
import TreeTrackDocument from "../sent-documents/tree-track-document";
import { Accordion, AccordionTab } from "primereact/accordion";
import PrimeReactBreadCrumb from "../../../../components/BreadCrumb";
import LinkedDocuments from "../linked-documents/linked-document-list";
import ReportList from "../reports/report-list";
import useAuthToken from "../../../hooks/use-authToken";
import Loading from "../../../../components/loading";
import SendDocument from "./components/send-document";
import DocumentDetails from "./components/doc-details";
import Appendants from "./components/appendants";
import Comments from "../comments/comments";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import CreateReport from "../reports/create-report";

const ReceivedDocumentDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { auth } = useAuth();
  const { authToken } = useAuthToken();
  const [toogleState, setToogleState] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [reportAdded, setReportAdded] = useState(Date.now());
  const toogleTab = (index) => {
    setToogleState(index);
  };
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const httpInterceptedService = useHttpInterceptedService();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await httpInterceptedService.get(
          `/sendDocument/getReceivedDocBySendDocId/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching received document details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [id]);

  useEffect(() => {
    const fetchChildDepartmentsById = async () => {
      try {
        const depId = auth.departments[0].depId;
        const response = await httpInterceptedService.get(
          // `/department/firstChild/${depId}`
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

    fetchChildDepartmentsById();
  }, [id]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const updatedReports = await httpInterceptedService.get(
          `/DocumentReport/getReportBySendDocId/${id}`
        );
        setReports(updatedReports.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [reportAdded]);

  const handleUpdateReports = () => {
    setReportAdded(Date.now());
  };

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
                  second={t("document.receivedDocuments.receivedDocumentsList")}
                  secondUrl={"/incoming-documents"}
                  last={t(
                    "document.receivedDocuments.receivedDocumentsDetails"
                  )}
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
                      {authToken?.roles.includes("document_share") && (
                        <li className="nav-item">
                          <button
                            className={
                              toogleState === 2
                                ? "nav-link active-tabs"
                                : "nav-link"
                            }
                            onClick={() => toogleTab(2)}
                            data-bs-toggle="tab"
                            data-bs-target="#document-send"
                          >
                            {t("shared.sendDocument")}
                          </button>
                        </li>
                      )}
                      {authToken?.roles?.includes("report_add") &&
                        data?.documentId?.executionType !== "INFORMATIVE" && (
                          <li className="nav-item">
                            <button
                              className={
                                toogleState === 3
                                  ? "nav-link active-tabs"
                                  : "nav-link"
                              }
                              onClick={() => toogleTab(3)}
                              data-bs-toggle="tab"
                              data-bs-target="#document-report"
                            >
                              {t("report.submitReport")}
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
                      id="document-send"
                    >
                      <SendDocument
                        data={data}
                        departmentOptions={departmentOptions}
                      />
                    </div>
                    <div
                      className={
                        toogleState === 3
                          ? "content-tab active-content-tab"
                          : "content-tab"
                      }
                      id="document-report"
                    >
                      <CreateReport
                        id={id}
                        setAddReport={handleUpdateReports}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <Accordion multiple activeIndex={[0]}>
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

                    {data?.documentId?.executionType !== "INFORMATIVE" &&
                      authToken?.roles.includes("report_view") && (
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

export default ReceivedDocumentDetails;
