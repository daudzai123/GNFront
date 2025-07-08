import { Tooltip } from "primereact/tooltip";
import { lazy, useEffect, useState } from "react";
import { Link, useNavigation, useSearchParams } from "react-router-dom";
import { useReferenceContext } from "../reference/reference-context";
import Pagination from "../../../../components/pagination";
import Spinner from "../../../../components/pagination";
import { FiEdit } from "react-icons/fi";
const UpdateReference = lazy(() => import("./update-reference"));
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IoIosAdd } from "react-icons/io";
import Loading from "../../../../components/loading";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { useTranslation } from "react-i18next";
import useAuthToken from "../../../../features/hooks/use-authToken";
const CreateReference = lazy(() => import("./create-reference"));

const ReferenceList = () => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const httpInterceptedService = useHttpInterceptedService();
  const navigation = useNavigation();
  const { reference, setReference } = useReferenceContext();
  const [references, setReferences] = useState([]);
  const [refCounts, setRefCounts] = useState([]);
  const [showUpdateReference, setShowUpdateReference] = useState(false);
  const [showAddReference, setShowAddReference] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedRefId, setSelectedRefId] = useState(null);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/reference/all";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getReferences = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setReferences(response.data?.content);
      setRefCounts(response.data);
    } catch (error) {
      console.error("Error fetching references:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReferences();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [reference, showAddReference, searchParams]);

  const handleEditClick = (reference) => {
    setShowUpdateReference(true);
    setReference(reference);
  };

  // Confirm Delete
  const confirmDelete = (event, refId) => {
    event.preventDefault();
    setSelectedRefId(refId);
    setConfirmationVisible(true);
  };

  const acceptConfirmation = async (refId) => {
    try {
      const response = await httpInterceptedService.delete(
        `/reference/getById/${refId}`
      );
      if (response.status === 200) {
        setReferences(references.filter((ref) => ref.id !== refId));
        toast.success(t("toast.referenceDeleteSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } else {
        toast.error(t("toast.referenceDeleteFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } catch (error) {
      console.error("Error removing reference:", error);
    } finally {
      setConfirmationVisible(false);
    }
  };

  const rejectConfirmation = () => {
    setConfirmationVisible(false);
  };

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          {reference && showUpdateReference && (
            <UpdateReference
              showUpdateReference={showUpdateReference}
              setShowUpdateReference={setShowUpdateReference}
            />
          )}
          {showAddReference && (
            <CreateReference setShowAddReference={setShowAddReference} />
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
                {t("reference.confirmDelete")}
              </div>
            }
            header= {t("shared.deleteConfirmation")}
            position="top"
            style={{ width: "30vw" }}
            breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
            acceptClassName="p-button-danger"
            acceptLabel={t("document.documentGrid.yes")}
            rejectLabel={t("document.documentGrid.no")}
            accept={() => acceptConfirmation(selectedRefId)}
            reject={rejectConfirmation}
          />
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <div className="card">
              {navigation.state !== "idle" && <Spinner />}
              <div className="card-header bg-dark d-flex justify-content-between">
                <h3 className="text-light">{t("reference.referenceList")}</h3>
                {authToken?.roles.includes("add_document_reference") && (
                  <button
                    onClick={() => setShowAddReference(true)}
                    className="btn btn-primary fw-bolder  mt-n1"
                  >
                    <IoIosAdd size={25} />
                    {t("reference.newReference")}
                  </button>
                )}
              </div>
              <div className="card-body" style={{ overflowX: "auto" }}>
                {references.length > 0 ? (
                  <table className="table table-striped">
                    <thead className="font-weight-bold">
                      <tr>
                        <th>{t("reference.referenceNum")}</th>
                        <th>{t("reference.referenceName")}</th>
                        <th>{t("shared.details")}</th>
                        <th>{t("shared.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {references.map((reference) => {
                        return (
                          <tr key={reference.id}>
                            <td>{reference.id}</td>
                            <td>{reference.refName}</td>
                            <td>{reference.description}</td>
                            <td className="table-action">
                              <Tooltip
                                target=".custom-edit-icon"
                                content={t("shared.edit")}
                                position="top"
                              />
                              {authToken?.roles.some((role) =>
                                ["edit_document_reference"].includes(role)
                              ) && (
                                <Link
                                  onClick={() => handleEditClick(reference)}
                                  className="ms-3"
                                >
                                  <FiEdit
                                    size={25}
                                    className="custom-edit-icon"
                                  />
                                </Link>
                              )}
                              <Tooltip
                                target=".delete-icon"
                                content={t("shared.delete")}
                                position="top"
                              />
                              {authToken?.roles.includes(
                                "delete_document_reference"
                              ) && (
                                <Link
                                  onClick={(e) =>
                                    confirmDelete(e, reference.id)
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
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div>{t("shared.notFound")}</div>
                )}
              </div>

              <div className="card-footer">
                <Pagination totalRecords={refCounts.totalElements} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReferenceList;
