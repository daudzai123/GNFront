import { Link, useSearchParams } from "react-router-dom";
import { lazy, useEffect, useRef, useState } from "react";
import { LuFileEdit } from "react-icons/lu";
import Pagination from "../../../components/pagination";
import Spinner from "../../../components/spinner";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import notfound from "@assets/images/notfound.jpeg";
const FilterDocuments = lazy(() => import("./filter-documents"));
import { Tooltip } from "primereact/tooltip";
import { IoIosRemoveCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loading from "../../../components/loading";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";
import useAuthToken from "../../hooks/use-authToken";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import {
  englishToPersianDigits,
  persianToEnglishDigits,
} from "../../../components/convert-digits";
import { ConfirmDialog } from "primereact/confirmdialog";

const DocumentList = () => {
  const { t } = useTranslation();
  const dt = useRef(null);
  const { authToken } = useAuthToken();
  const httpInterceptedService = useHttpInterceptedService();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docCounts, setDocCounts] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [searchResultFound, setSearchResultsFound] = useState(true);
  const [referenceData, setReferenceData] = useState([]);

  const getReferenceData = (data) => {
    setReferenceData(data);
  };

  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/document/getByDepartment";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getDocuments = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setDocuments(response.data?.content);
      setDocCounts(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchParams]);

  // Filter
  const toggleFilter = () => {
    setShowFilter((prevShowFilter) => !prevShowFilter);
  };

  const [filters, setFilters] = useState({
    docNumber: "",
    docNumber2: "",
    docType: "",
    subject: "",
    referenceType: "",
    documentCreationStartDate: "",
    documentCreationEndDate: "",
    searchTerm: "",
    referenceId: null,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setFilterLoading(true);

    const convertedFilters = {
      ...filters,
      docNumber: persianToEnglishDigits(filters.docNumber),
      docNumber2: persianToEnglishDigits(filters.docNumber2),
      subject: persianToEnglishDigits(filters.subject),
    };

    const filteredOptions = Object.fromEntries(
      Object.entries(convertedFilters).filter(([key, value]) => {
        return value !== "" && value !== null;
      })
    );

    const queryString = Object.entries(filteredOptions)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    try {
      const response = await httpInterceptedService.get(
        `/document/filter?${queryString}`
      );
      if (response && response.data.content?.length > 0) {
        setDocuments(response.data?.content);
        setSearchResultsFound(true);
      } else {
        setDocuments([]);
        setSearchResultsFound(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  // Cancel Filter
  const resetFilter = () => {
    getDocuments();
    setSearchResultsFound(true);
    setFilterLoading(true);
    setFilters({
      docNumber: "",
      docNumber2: "",
      docType: "",
      subject: "",
      referenceType: "",
      documentCreationStartDate: "",
      documentCreationEndDate: "",
      searchTerm: "",
      referenceId: null,
    });
  };

  // For DataTable and Export
  const columns = [
    {
      field: "incrementalNumber",
      header: t("shared.number"),
      body: (rowData, options) =>
        englishToPersianDigits((options.rowIndex + 1).toString()),
    },
    {
      field: "docNumber",
      header: t("shared.docNum"),
      body: (rowData) => englishToPersianDigits(rowData.docNumber),
    },
    // {
    //   field: "docNumber2",
    //   header: t("shared.docNumLeader"),
    //   body: (rowData) =>
    //     rowData.docNumber2 ? englishToPersianDigits(rowData.docNumber2) : "-",
    // },
    {
      field: "subject",
      header: t("shared.subject"),
      body: (rowData) => englishToPersianDigits(rowData.subject),
    },
    {
      field: "initialDate",
      header: t("shared.initialDate"),
      body: (rowData) => {
        if (rowData.initialDate) {
          const convertedInitialDate = new Date(rowData.initialDate)
            .toLocaleDateString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-");

          return <span>{convertedInitialDate}</span>;
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      field: "receivedData",
      header: t("shared.receivedDate"),
      body: (rowData) => {
        if (rowData.receivedDate) {
          const convertedReceivedDate = new Date(rowData.receivedDate)
            .toLocaleDateString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-");

          return <span>{convertedReceivedDate}</span>;
        } else {
          return <span>-</span>;
        }
      },
    },

    {
      field: "docType",
      header: t("shared.docType"),
      body: (rowData) => (
        <span>
          {rowData.docType === "MAKTOOB"
            ? t("filter.maktoob")
            : rowData.docType === "FARMAN"
            ? t("filter.farman")
            // : rowData.docType === "MUSAWWIBA"
            // ? t("filter.musawiba")
            // : rowData.docType === "HIDAYAT"
            // ? t("filter.hidayat")
            // : rowData.docType === "HUKAM"
            // ? t("filter.hukam")
            // : rowData.docType === "REPORT"
            // ? t("filter.report")
            : rowData.docType}
        </span>
      ),
    },
    // {
    //   field: "referenceType",
    //   header: t("shared.reference"),
    //   body: (rowData) => (
    //     <span>
    //       {rowData.referenceType === "AMIR"
    //         ? t("filter.leader")
    //         : rowData.referenceType === "RAYESULWOZARA"
    //         ? t("filter.rayesulwozara")
    //         : rowData.referenceType === "KABINA"
    //         ? t("filter.kabina")
    //         : rowData.referenceType === "FINANCE_KABINA"
    //         ? t("filter.economicKabina")
    //         : rowData.referenceType === null
    //         ? "-"
    //         : rowData.referenceType}
    //     </span>
    //   ),
    // },

    // {
    //   field: "impReference",
    //   header: t("shared.referenceImpl"),
    //   body: (rowData) =>
    //     rowData.impReference && rowData.impReference !== "Not Applicable"
    //       ? rowData.impReference
    //       : "-",
    // },

    {
      field: "exectuionType",
      header: t("shared.executionType"),
      body: (rowData) => (
        <span>
          {rowData.executionType === "CONTINUOUS"
            ? t("shared.continuous")
            : rowData.executionType === "INFORMATIVE"
            ? t("shared.informative")
            : rowData.docType === "RESULT_BASE"
            ? t("shared.resultBased")
            : "-"}
        </span>
      ),
    },
    {
      field: "actions",
      header: t("shared.actions"),
      body: (rowData) => (
        <>
          <Tooltip
            target=".custom-edit-btn"
            content={t("shared.details")}
            position="top"
          />
          {authToken?.roles.includes("document_view") && (
            <Link to={`/documents/${rowData.docId}`} className="ms-3">
              <LuFileEdit size={30} className="custom-edit-btn" />
            </Link>
          )}
          <Tooltip
            target=".delete-icon"
            content={t("shared.delete")}
            position="top"
          />
          {authToken?.roles.includes("document_delete") && (
            <Link onClick={(e) => confirmDelete(e, rowData.docId)}>
              <IoIosRemoveCircle size={30} className="delete-icon" />
            </Link>
          )}
        </>
      ),
    },
  ];

  const exportColumns = [
    { title: t("shared.receivedDate"), dataKey: "receivedDate" },
    { title: t("shared.initialDate"), dataKey: "initialDate" },
    { title: t("shared.executionType"), dataKey: "executionType" },
    { title: t("shared.reference"), dataKey: "referenceType" },
    { title: t("shared.referenceImpl"), dataKey: "impReference" },
    { title: t("shared.docType"), dataKey: "docType" },
    { title: t("shared.subject"), dataKey: "subject" },
    { title: t("shared.docNumLeader"), dataKey: "docNumber2" },
    { title: t("shared.docNum"), dataKey: "docNumber" },
    { title: t("shared.number"), dataKey: "incrementalNumber" },
  ];

  const mapDocType = (type) => {
    return type === "FARMAN"
      ? t("filter.farman")
      : type === "HUKAM"
      ? t("filter.hukam")
      : type === "HIDAYAT"
      ? t("filter.hidayat")
      : type === "MUSAWWIBA"
      ? t("filter.musawiba")
      : type;
  };

  const mapExecutionType = (executionType) => {
    return executionType === "CONTINUOUS"
      ? t("shared.continuous")
      : executionType === "INFORMATIVE"
      ? t("shared.informative")
      : docType === "RESULT_BASE"
      ? t("shared.resultBased")
      : "-";
  };

  const mapReferenceType = (referenceType) => {
    switch (referenceType) {
      case "AMIR":
        return t("filter.leader");
      case "RAYESULWOZARA":
        return t("filter.rayesulwozara");
      case "KABINA":
        return t("filter.kabina");
      case "FINANCE_KABINA":
        return t("filter.economicKabina");
      default:
        return "-";
    }
  };

  const mapImpReference = (referenceId) => {
    const impReference = referenceData.find((ref) => ref.value === referenceId);
    return impReference ? impReference.label : "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString)
      .toLocaleDateString("fa-Persian", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        calendar: "islamic-umalqura",
      })
      .replace(/\//g, "-");
  };

  const prepareDataForExport = (data) => {
    return data.map((row, index) => ({
      ...row,
      incrementalNumber: englishToPersianDigits((index + 1).toString()),
      docNumber: englishToPersianDigits(row.docNumber),
      docNumber2: row.docNumber2 ? englishToPersianDigits(row.docNumber2) : "-",
      subject: englishToPersianDigits(row.subject),
      referenceType: mapReferenceType(row.referenceType),
      executionType: mapExecutionType(row.executionType),
      docType: mapDocType(row.docType),
      impReference: mapImpReference(row.impReference),
      initialDate: formatDate(row.initialDate),
      receivedDate: formatDate(row.receivedDate),
    }));
  };

  // For Filter Criteria Header
  const formatFilterValue = (key, value) => {
    switch (key) {
      case "docType":
        return mapDocType(value);
      case "referenceType":
        return mapReferenceType(value);
      case "referenceId":
        return mapImpReference(value);
      case "executionType":
        return mapExecutionType(value);
      case "documentCreationStartDate":
      case "documentCreationEndDate":
        return formatDate(value);
      default:
        return value;
    }
  };

  const mapFilterCriteria = (filters) => {
    const filterLabels = {
      docNumber: t("shared.docNum"),
      docNumber2: t("shared.docNumLeader"),
      docType: t("shared.docType"),
      subject: t("shared.subject"),
      referenceType: t("shared.reference"),
      referenceId: t("shared.referenceImpl"),
      executionType: t("shared.executionType"),
      documentCreationStartDate: t("filter.startDate"),
      documentCreationEndDate: t("filter.endDate"),
      searchTerm: t("shared.searchTerm"),
    };

    return Object.entries(filters)
      .filter(([key, value]) => {
        return value !== "" && value !== null;
      })
      .map(([key, value]) => {
        return `${filterLabels[key]}: ${formatFilterValue(key, value)}`;
      });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDFModule) => {
      import("jspdf-autotable").then(() => {
        const jsPDF = jsPDFModule.default;
        const doc = new jsPDF({ orientation: "landscape" });
        try {
          doc.addFont(
            "../fonts/BahijHelveticaNeue-Roman.ttf",
            "BahijHelvetica",
            "normal"
          );
          doc.setFont("BahijHelvetica");
          const modifiedData = prepareDataForExport(documents);
          const body = modifiedData.map((row) =>
            exportColumns.map((col) => row[col.dataKey])
          );
          const titlesHeader = exportColumns.map((col) => col.title);
          const filterCriteriaHeader = mapFilterCriteria(filters);

          doc.autoTable({
            head: [filterCriteriaHeader],
            body: [],
            styles: {
              font: "BahijHelvetica",
              fontStyle: "normal",
              halign: "right",
            },
            headStyles: {
              fillColor: [106, 106, 106],
            },
          });
          doc.autoTable({
            head: [titlesHeader],
            body: body,
            styles: {
              font: "BahijHelvetica",
              fontStyle: "bold",
              halign: "right",
              cellWidth: "wrap",
            },
            columnStyles: {
              cellWidth: "auto",
            },
          });
          doc.save("documents-filtered-data.pdf");
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const data = prepareDataForExport(documents);

      const worksheetData = data.map((row) =>
        exportColumns.map((col) => row[col.dataKey])
      );

      const worksheet = xlsx.utils.aoa_to_sheet([
        mapFilterCriteria(filters),
        exportColumns.map((col) => col.title),
        ...worksheetData,
      ]);

      const columnWidths = exportColumns.map(() => ({ wpx: 100 }));
      worksheet["!cols"] = columnWidths;

      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };

      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
        compression: true,
      });

      saveAsExcelFile(excelBuffer, "documents-filtered-data");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const header = (
    <div className="d-flex align-items-center justify-content-between gap-2">
      <h3>{t("shared.documentList")}</h3>
      <div>
        <Button
          className="export-excel-button ms-2"
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="EXCEL"
        />
        <Button
          className="export-pdf-button"
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
    </div>
  );

  // Confirm Delete
  const confirmDelete = (event, docId) => {
    event.preventDefault();
    setSelectedDocId(docId);
    setConfirmationVisible(true);
  };

  const acceptConfirmation = async (docId) => {
    try {
      const response = await httpInterceptedService.delete(
        `/document/delete/${docId}`
      );

      if (response.status === 200) {
        setDocuments(documents.filter((doc) => doc.docId !== docId));
        toast.success(t("toast.deleteDocSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } else {
        toast.error(t("toast.deleteDocFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } catch (error) {
      console.error("Error remove document:", error);
      toast.error(t("toast.deleteDocError"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      setConfirmationVisible(false);
    }
  };

  const rejectConfirmation = () => {
    setConfirmationVisible(false);
  };

  return (
    <>
      {/* <div className="row">
        <div className="col-12">
          <ConfirmDialog
            visible={confirmationVisible}
            onHide={() => setConfirmationVisible(false)}
            message={
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="pi pi-info-circle"
                  style={{ marginLeft: "8px", fontSize: "1.5em" }}
                ></i>
                {t("document.documentGrid.confirmDelete")}
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
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <>
              <div className="mb-3">
                <button
                  className="btn btn-lg btn-info mb-3"
                  onClick={toggleFilter}
                >
                  {showFilter ? t("filter.hide") : t("filter.filter")}
                </button>
                {showFilter && (
                  <FilterDocuments
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    getReferenceData={getReferenceData}
                    resetFilter={resetFilter}
                  />
                )}
              </div>

              <div className="card">
                {filterLoading ? (
                  <Spinner />
                ) : searchResultFound && documents.length === 0 ? (
                  <div className="card-body">
                    <div className="text-center">
                      <img src={emptyFolder} alt="Empty Folder" width={100} />
                    </div>
                    <p
                      className="alert-warning text-center mt-3"
                      style={{ width: "100%" }}
                    >
                      {t("document.sentDocuments.emptyList")}
                    </p>
                  </div>
                ) : !searchResultFound && documents.length === 0 ? (
                  <div className="card-body">
                    <div className="text-center">
                      <img src={notfound} alt="Not Found" width={100} />
                    </div>
                    <p className="alert-warning text-center mt-3">
                      {t("shared.notFound")}
                    </p>
                  </div>
                ) : (
                  <div className="card-body">
                    <Tooltip target=".export-excel-button" position="top" />
                    <Tooltip target=".export-pdf-button" position="top" />
                    <DataTable
                      value={documents}
                      ref={dt}
                      tableStyle={{ minWidth: "50rem" }}
                      header={header}
                      stripedRows
                    >
                      {columns.map((col, i) => (
                        <Column
                          key={i}
                          field={col.field}
                          header={col.header}
                          body={col.body}
                          style={{ textAlign: "right" }}
                          headerClassName="bg-dark text-light"
                        />
                      ))}
                    </DataTable>
                  </div>
                )}
                {searchResultFound && (
                  <div className="card-footer">
                    <Pagination totalRecords={docCounts.totalElements} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div> */}
      {/* <div className="row">
  <div className="col-12">
    <ConfirmDialog
      visible={confirmationVisible}
      onHide={() => setConfirmationVisible(false)}
      message={
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="pi pi-info-circle text-primary"
            style={{ marginLeft: "8px", fontSize: "1.5em" }}
          ></i>
          {t("document.documentGrid.confirmDelete")}
        </div>
      }
      header={t("shared.deleteConfirmation")}
      position="top"
      style={{
        width: "30vw",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
      acceptClassName="p-button-danger"
      acceptLabel={t("document.documentGrid.yes")}
      rejectLabel={t("document.documentGrid.no")}
      accept={() => acceptConfirmation(selectedDocId)}
      reject={rejectConfirmation}
    />
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-3">
          <button
            className="btn btn-lg btn-info mb-3 shadow-sm"
            onClick={toggleFilter}
            style={{
              borderRadius: "20px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {showFilter ? t("filter.hide") : t("filter.filter")}
          </button>
          {showFilter && (
            <FilterDocuments
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              getReferenceData={getReferenceData}
              resetFilter={resetFilter}
            />
          )}
        </div>

        <div className="card shadow-lg border-0">
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center">
              <img
                src={emptyFolder}
                alt="Empty Folder"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3 rounded"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fffae6",
                  border: "1px solid #ffe58f",
                }}
              >
                {t("document.sentDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center">
              <img
                src={notfound}
                alt="Not Found"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3 rounded"
                style={{
                  padding: "10px",
                  backgroundColor: "#ffebe6",
                  border: "1px solid #ffccc7",
                }}
              >
                {t("shared.notFound")}
              </p>
            </div>
          ) : (
            <div className="card-body">
              <Tooltip target=".export-excel-button" position="top" />
              <Tooltip target=".export-pdf-button" position="top" />
              <DataTable
                value={documents}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                header={header}
                stripedRows
              >
                {columns.map((col, i) => (
                  <Column
                    key={i}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    style={{
                      textAlign: "center",
                      padding: "15px",
                      border: "1px solid #e0e0e0",
                      margin: "5px",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    headerClassName="bg-primary text-light rounded"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div
              className="card-footer text-center bg-light"
              style={{
                padding: "15px",
                borderTop: "1px solid #ddd",
                borderRadius: "0 0 10px 10px",
              }}
            >
              <Pagination totalRecords={docCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}


{/* <div className="row" style={{ margin: 0 }}>
  <div className="col-12" style={{ padding: 0 }}>
    <ConfirmDialog
      visible={confirmationVisible}
      onHide={() => setConfirmationVisible(false)}
      message={
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="pi pi-info-circle text-primary"
            style={{ marginLeft: "8px", fontSize: "1.5em" }}
          ></i>
          {t("document.documentGrid.confirmDelete")}
        </div>
      }
      header={t("shared.deleteConfirmation")}
      position="top"
      style={{
        width: "30vw",
        // borderRadius: "0",
        // boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
      }}
      breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
      acceptClassName="p-button-danger"
      acceptLabel={t("document.documentGrid.yes")}
      rejectLabel={t("document.documentGrid.no")}
      accept={() => acceptConfirmation(selectedDocId)}
      reject={rejectConfirmation}
    />
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-0">
          <button
            className="btn btn-lg btn-info mb-0 shadow-sm"
            onClick={toggleFilter}
            style={{
              // borderRadius: "0",
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom: 0,
            }}
          >
            {showFilter ? t("filter.hide") : t("filter.filter")}
          </button>
          {showFilter && (
            <FilterDocuments
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              getReferenceData={getReferenceData}
              resetFilter={resetFilter}
            />
          )}
        </div>

        <div className="card shadow-lg border-0" style={{ margin: 0 }}>
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center" style={{ padding: "15px" }}>
              <img
                src={emptyFolder}
                alt="Empty Folder"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3 "
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fffae6",
                  // border: "0.5px solid #ffe58f", // 0.5px border applied here
                }}
              >
                {t("document.sentDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center" style={{ padding: "15px" }}>
              <img
                src={notfound}
                alt="Not Found"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3 "
                style={{
                  padding: "10px",
                  backgroundColor: "#ffebe6",
                  // border: "0.5px solid #ffccc7", // 0.5px border applied here
                }}
              >
                {t("shared.notFound")}
              </p>
            </div>
          ) : (
            <div className="card-body" style={{ padding: "0" }}>
              <Tooltip target=".export-excel-button" position="top" />
              <Tooltip target=".export-pdf-button" position="top" />
              <DataTable
                value={documents}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  border: "none", // 0.5px border applied here
                  // borderRadius: "0",
                  backgroundColor: "#f8f9fa",
                  // boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
                }}
                header={header}
                stripedRows
              >
                {columns.map((col, i) => (
                  <Column
                    key={i}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    style={{
                      textAlign: "center",
                      padding: "10px", // Padding applied here
                      border: "none", // 0.5px border applied here
                      margin: "0", // Gap removed between fields
                      // borderRadius: "0",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    headerClassName="bg-primary text-light rounded"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div
              className="card-footer text-center bg-light"
              style={{
                padding: "5px", // Padding applied to footer
                borderTop: "0.5px solid #ddd", // 0.5px border applied here
                // borderRadius: "0",
              }}
            >
              <Pagination totalRecords={docCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}
{/* <div className="row" style={{ margin: 0 }}>
  <div className="col-12" style={{ padding: 0 }}>
    <ConfirmDialog
      visible={confirmationVisible}
      onHide={() => setConfirmationVisible(false)}
      message={
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="pi pi-info-circle text-primary"
            style={{ marginLeft: "8px", fontSize: "1.5em" }}
          ></i>
          {t("document.documentGrid.confirmDelete")}
        </div>
      }
      header={t("shared.deleteConfirmation")}
      position="top"
      style={{
        width: "30vw",
        borderRadius: "0", // Removed border radius from heading
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
      acceptClassName="p-button-danger"
      acceptLabel={t("document.documentGrid.yes")}
      rejectLabel={t("document.documentGrid.no")}
      accept={() => acceptConfirmation(selectedDocId)}
      reject={rejectConfirmation}
    />
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-0">
          <button
            className="btn btn-lg btn-info mb-0 shadow-sm"
            onClick={toggleFilter}
            style={{
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom: 0,
            }}
          >
            {showFilter ? t("filter.hide") : t("filter.filter")}
          </button>
          {showFilter && (
            <FilterDocuments
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              getReferenceData={getReferenceData}
              resetFilter={resetFilter}
            />
          )}
        </div>

        <div className="card shadow-lg border-0" style={{ margin: 0 }}>
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center" style={{ padding: "15px" }}>
              <img
                src={emptyFolder}
                alt="Empty Folder"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fffae6",
                }}
              >
                {t("document.sentDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center" style={{ padding: "15px" }}>
              <img
                src={notfound}
                alt="Not Found"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  padding: "10px",
                  backgroundColor: "#ffebe6",
                }}
              >
                {t("shared.notFound")}
              </p>
            </div>
          ) : (
            <div className="card-body" style={{ padding: "0" }}>
              <Tooltip target=".export-excel-button" position="top" />
              <Tooltip target=".export-pdf-button" position="top" />
              <DataTable
                value={documents}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  border: "none",
                  backgroundColor: "#f8f9fa",
                }}
                header={header}
                stripedRows
              >
                {columns.map((col, i) => (
                  <Column
                    key={i}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "none",
                      margin: "0",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    headerClassName="bg-primary text-light"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div
              className="card-footer text-center bg-light"
              style={{
                padding: "5px",
                borderTop: "0.5px solid #ddd",
              }}
            >
              <Pagination totalRecords={docCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}

<div className="row" style={{ margin: 0 }}>
  <div className="col-12" style={{ padding: 0}} >
    <ConfirmDialog
      visible={confirmationVisible}
      onHide={() => setConfirmationVisible(false)}
      message={
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="pi pi-info-circle text-primary"
            style={{ marginLeft: "8px", fontSize: "1.5em" }}
          ></i>
          {t("document.documentGrid.confirmDelete")}
        </div>
      }
      header={t("shared.deleteConfirmation")}
      position="top"
      style={{
        width: "30vw",
        borderRadius: "0", // Removed border radius from heading
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
      acceptClassName="p-button-danger"
      acceptLabel={t("document.documentGrid.yes")}
      rejectLabel={t("document.documentGrid.no")}
      accept={() => acceptConfirmation(selectedDocId)}
      reject={rejectConfirmation}
    />
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-0" >
          <button
            className="btn btn-lg btn-info mb-0 shadow-sm"
            onClick={toggleFilter}
            style={{
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom: 0,
            }}
          >
            {showFilter ? t("filter.hide") : t("filter.filter")}
          </button>
          {showFilter && (
            <FilterDocuments
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              getReferenceData={getReferenceData}
              resetFilter={resetFilter}
            />
          )}
        </div>

        <div className="card shadow-lg border-0" style={{ margin: 0}}  >
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center" style={{ padding: "15px" }}>
              <img
                src={emptyFolder}
                alt="Empty Folder"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fffae6",
                }}
              >
                {t("document.sentDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && documents.length === 0 ? (
            <div className="card-body text-center" style={{ padding: "15px" }}>
              <img
                src={notfound}
                alt="Not Found"
                width={120}
                className="mb-3"
              />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  padding: "10px",
                  backgroundColor: "#ffebe6",
                }}
              >
                {t("shared.notFound")}
              </p>
            </div>
          ) : (
            <div className="card-body" style={{ padding: "0" }}>
              <Tooltip target=".export-excel-button" position="top" />
              <Tooltip target=".export-pdf-button" position="top" />
              <DataTable
                value={documents}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  border: "none",
                  backgroundColor: "#f8f9fa",
                  
                }}
                header={header}
                stripedRows
              >
                {columns.map((col, i) => (
                  <Column
                    key={i}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "none",
                      margin: "0",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    headerClassName="bg-primary text-light"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div
              className="card-footer text-center bg-light"
              style={{
                padding: "5px",
                borderTop: "0.5px solid #ddd",
                
              }}
            >
              <Pagination totalRecords={docCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div>


    </>
  );
};

export default DocumentList;
