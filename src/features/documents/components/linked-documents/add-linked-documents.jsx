import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const NewLinkedDocuments = ({
  showAddLinking,
  setShowAddLinking,
  docId,
  setIsLinkingUpdated,
}) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();
  const [linkedDocuments, setLinkedDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      firstDocId: docId,
    },
  });

  // Search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm) {
      setLoading(true);
      try {
        const response = await httpInterceptedService.get(
          `/document/forlinking?searchterm=${searchTerm}`
        );
        setLinkedDocuments(response.data);
      } catch (error) {
        console.error("Error fetching linked documents:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLinkedDocuments([]);
    }
  };

  // Submit add linking
  const onSubmit = async (data) => {
    const { firstDocId } = data;
    const secondDocId = selectedDocument?.docId;
    const linkingsData = { firstDocId, secondDocId };
    try {
      await httpInterceptedService.post("/linking/add", linkingsData);
      reset();
      setShowAddLinking(false);
      setIsLinkingUpdated();
      toast.success(t("toast.linkedDocAddSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.linkedDocAddFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  const onClose = () => {
    setShowAddLinking(false);
  };

  const docTypeBodyTemplate = (rowData) => {
    switch (rowData.docType) {
      case "FARMAN":
        return t("filter.farman");
      case "MUSAWIBA":
        return t("filter.musawiba");
      case "HIDAYAT":
        return t("filter.hidayat");
      case "HUKAM":
        return t("filter.hukam");
      default:
        return rowData.docType;
    }
  };

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          <Dialog
            header={
              <h3 className="text-muted text-center">
                {t("shared.newLinkedDoc")}
              </h3>
            }
            visible={showAddLinking}
            onHide={onClose}
            footer={null}
            style={{ width: "50vw" }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row my-3">
                <label className="form-label">{t("shared.linkedDoc")}</label>
                <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
                  <input
                    type="text"
                    id="searchTerm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control form-control-lg mb-3"
                    placeholder={t("filter.search")}
                    autoComplete="off"
                  />
                </div>
                <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
                  <button
                    type="button"
                    className="btn btn-lg btn-info"
                    onClick={handleSearch}
                  >
                    {t("shared.search")}
                  </button>
                </div>

                {loading ? (
                  <div className="text-center">
                    <span
                      className="spinner-border text-info"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </div>
                ) : (
                  <DataTable
                    value={linkedDocuments}
                    scrollable
                    scrollHeight="400px"
                    selectionMode="single"
                    selection={selectedDocument}
                    onSelectionChange={(e) => setSelectedDocument(e.value)}
                    dataKey="docId"
                    tableStyle={{ minWidth: "50rem" }}
                    emptyMessage={t("shared.notFound")}
                  >
                    <Column field="docId" header={t("shared.id")}></Column>
                    <Column
                      field="docNumber"
                      header={t("shared.docNum")}
                    ></Column>
                    <Column
                      field="subject"
                      header={t("shared.subject")}
                    ></Column>
                    <Column
                      field="docType"
                      header={t("shared.docType")}
                      body={docTypeBodyTemplate}
                    ></Column>
                  </DataTable>
                )}
              </div>
              <div className="row">
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-lg btn-outline-dark ms-2"
                    onClick={onClose}
                  >
                    {t("filter.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary"
                    disabled={!selectedDocument || isSubmitting}
                  >
                    {isSubmitting
                      ? t("reference.submitting")
                      : t("shared.save")}
                  </button>
                </div>
              </div>
            </form>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default NewLinkedDocuments;
