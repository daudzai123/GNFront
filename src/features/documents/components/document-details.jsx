import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/use-auth";
import TrackDocument from "./sent-documents/track-document";
import { Accordion, AccordionTab } from "primereact/accordion";
import PrimeReactBreadCrumb from "../../../components/BreadCrumb";
import LinkedDocuments from "./linked-documents/linked-document-list";
import useAuthToken from "../../hooks/use-authToken";
import Appendants from "./document-details-subComponents/appendants";
import SendDocument from "./document-details-subComponents/send-document";
import UpdateDocument from "./document-details-subComponents/update-document";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";
import { useParams } from "react-router-dom";
import Details from "./document-details-subComponents/doc-details";
import Loading from "../../../components/loading";

const DocumentDetails = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { id } = useParams();
  const { authToken } = useAuthToken();
  const [toogleState, setToogleState] = useState(1);
  const toogleTab = (index) => {
    setToogleState(index);
  };
  const [data, setData] = useState([]);
  const [updateKey, setUpdateKey] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const httpInterceptedService = useHttpInterceptedService();
  const [userDepartmentOptions, setUserDepartmentOptions] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const fetchDocuments = async () => {
    try {
      const response = await httpInterceptedService.get(
        `/document/getDocumentById/${id}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching documents data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id, updateKey]);

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
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const getReferences = async () => {
      try {
        const response = await httpInterceptedService.get(
          "/reference/allwithoutpage"
        );

        if (response.data) {
          const options = response.data.map((reference) => ({
            value: reference.id,
            label: reference.refName,
          }));
          setReferenceOptions(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    getReferences();
  }, []);

  useEffect(() => {
    if (auth && auth.departments) {
      const mappedDepartments = auth.departments.map((dep) => ({
        label: dep.depName,
        value: dep.depId,
      }));
      setUserDepartmentOptions(mappedDepartments);
    }
  }, [auth]);

  return (
    <>
      {loading ? (
        <Loading theme="primary" />
      ) : (
        <>
          <div className="row">
            <div className="col-xl-12">
              <div className="mb-2">
                <PrimeReactBreadCrumb
                  first={t("mainLayout.sidebar.home")}
                  firstUrl={"/"}
                  second={t("shared.documentList")}
                  secondUrl={"/documents"}
                  last={t("shared.details")}
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
                      {authToken?.roles.includes("document_update") && (
                        <li className="nav-item">
                          <button
                            className={
                              toogleState === 2
                                ? "nav-link active-tabs"
                                : "nav-link"
                            }
                            onClick={() => toogleTab(2)}
                            data-bs-toggle="tab"
                            data-bs-target="#document-edit"
                          >
                            {t("shared.edit")}
                          </button>
                        </li>
                      )}
                      {authToken?.roles.includes("document_share") && (
                        <li className="nav-item">
                          <button
                            className={
                              toogleState === 3
                                ? "nav-link active-tabs"
                                : "nav-link"
                            }
                            onClick={() => toogleTab(3)}
                            data-bs-toggle="tab"
                            data-bs-target="#document-send"
                          >
                            {t("shared.sendDocument")}
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
                      <Details data={data} />
                    </div>
                    <div
                      className={
                        toogleState === 2
                          ? "content-tab active-content-tab"
                          : "content-tab"
                      }
                      id="document-edit"
                    >
                      <UpdateDocument
                        data={data}
                        handleUpdate={handleUpdate}
                        userDepartmentOptions={userDepartmentOptions}
                        referenceOptions={referenceOptions}
                      />
                    </div>

                    <div
                      className={
                        toogleState === 3
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <Accordion multiple activeIndex={[0]}>
                    <AccordionTab header={t("shared.appendants")}>
                      <Appendants data={data} handleUpdate={handleUpdate} />
                    </AccordionTab>
                    {authToken?.roles.includes("view_linked_documents") && (
                      <AccordionTab header={t("shared.linkedDoc")}>
                        <LinkedDocuments docId={data.docId} />
                      </AccordionTab>
                    )}
                    {authToken?.roles.includes("view_document_tracking") && (
                      <AccordionTab header={t("shared.trackDoc")}>
                        <TrackDocument />
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

export default DocumentDetails;
