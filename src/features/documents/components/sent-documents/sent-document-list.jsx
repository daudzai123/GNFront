import { Tooltip } from "primereact/tooltip";
import { lazy, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TbListDetails } from "react-icons/tb";
const Filter = lazy(() => import("../../../../components/filter"));
import notfound from "@assets/images/notfound.jpeg";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import Pagination from "../../../../components/pagination";
import Spinner from "../../../../components/spinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import useAuth from "../../../hooks/use-auth";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import Loading from "../../../../components/loading";
import useAuthToken from "../../../hooks/use-authToken";
import {
  englishToPersianDigits,
  persianToEnglishDigits,
} from "../../../../components/convert-digits";

const SentDocumentList = () => {
  const { t, i18n } = useTranslation();
  const { auth } = useAuth();
  const { authToken } = useAuthToken();
  const dt = useRef(null);
  const httpInterceptedService = useHttpInterceptedService();
  const [sentDocuments, setSentDocuments] = useState([]);
  const [sentDocCounts, setSentDocCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResultFound, setSearchResultsFound] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const navigate = useNavigate();

  // Fetch Sent Documents Data
  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/sendDocument/filter1";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getSentDocuments = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setSentDocuments(response.data?.content);
      setSentDocCounts(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    getSentDocuments();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchParams]);

  useEffect(() => {
    if (auth && auth.departments) {
      const mappedDepartments = auth.departments.map((dep) => ({
        depName: dep.depName,
        depId: dep.depId.toString(),
      }));
      setDepartmentData(mappedDepartments);
    }
  }, [auth]);

  useEffect(() => {
    const url = new URL(window.location.href);
    navigate(url.pathname + url.search);
  }, [i18n.language]);

  // Filter
  const toggleFilter = () => {
    setShowFilter((prevShowFilter) => !prevShowFilter);
  };

  const [filters, setFilters] = useState({
    documentNo: "",
    documentNo2: "",
    documentType: "",
    documentStatus: "",
    subject: "",
    sendingDateStart: "",
    sendingDateEnd: "",
    referenceType: "",
    senderDepartmentIds: [],
    searchTerm: "",
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
      documentNo: persianToEnglishDigits(filters.documentNo),
      documentNo2: persianToEnglishDigits(filters.documentNo2),
      subject: persianToEnglishDigits(filters.subject),
    };
    const filteredOptions = Object.fromEntries(
      Object.entries(convertedFilters).filter(([key, value]) => {
        if (key === "senderDepartmentIds" || key === "receiverDepartmentIds") {
          return Array.isArray(value) && value.length > 0;
        }
        return value !== "";
      })
    );

    const queryString = Object.entries(filteredOptions)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    try {
      const response = await httpInterceptedService.get(
        `/sendDocument/filter3?${queryString}`
      );
      if (response && response.data.length > 0) {
        setSentDocuments(response.data);
        setSearchResultsFound(true);
      } else {
        setSentDocuments([]);
        setSearchResultsFound(false);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  const resetFilter = () => {
    getSentDocuments();
    setSearchResultsFound(true);
    setFilterLoading(true);
    setFilters({
      documentNo: "",
      documentNo2: "",
      documentType: "",
      documentStatus: "",
      subject: "",
      sendingDateStart: "",
      sendingDateEnd: "",
      referenceType: "",
      senderDepartmentIds: [],
      searchTerm: "",
    });
  };

  // Filter sentDocuments based on role to view secret documents
  const filteredDocuments = authToken?.roles.includes("secret_view")
    ? sentDocuments
    : sentDocuments.filter((doc) => doc.secret !== "SECRET");

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
    {
      field: "subject",
      header: t("shared.subject"),
      body: (rowData) => englishToPersianDigits(rowData.subject),
    },
    {
      field: "receiverDepartments",
      header: t("shared.receiver"),
      body: (rowData) =>
        rowData.receiverDepartments ? rowData.receiverDepartments.depName : "-",
    },
    {
      field: "creationDate",
      header: t("shared.creationDate"),
      body: (rowData) => {
        if (rowData.creationDate) {
          const convertedCreationDate = new Date(rowData.creationDate)
            .toLocaleDateString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-");

          return <span>{convertedCreationDate}</span>;
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      field: "deadline",
      header: t("shared.deadline"),
      body: (rowData) => {
        if (rowData.deadline) {
          const convertedDeadline = new Date(rowData.deadline)
            .toLocaleDateString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-");

          return <span>{convertedDeadline}</span>;
        } else {
          return <span>-</span>;
        }
      },
    },
    {
      field: "sendingDate",
      header: t("shared.sendingDate"),
      body: (rowData) => (
        <span>
          {new Date(rowData.sendingDate)
            .toLocaleDateString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-")}
        </span>
      ),
    },
    {
      field: "secret",
      header: t("shared.secrecy"),
      body: (rowData) => (
        <span
          className={
            rowData.secret
              ? rowData.secret === "SECRET"
                ? "badge bg-danger"
                : "badge bg-primary"
              : ""
          }
        >
          {rowData.secret
            ? rowData.secret === "SECRET"
              ? t("shared.secret")
              : t("shared.nonSecret")
            : "-"}
        </span>
      ),
    },

    {
      field: "sendingStatus",
      header: t("shared.sendingStatus"),
      body: (rowData) => (
        <span
          className={
            rowData.sendingStatus
              ? rowData.sendingStatus === "PENDING"
                ? "badge bg-warning"
                : "badge bg-success"
              : ""
          }
        >
          {rowData.sendingStatus
            ? rowData.sendingStatus === "PENDING"
              ? t("shared.pending")
              : t("shared.seen")
            : "-"}
        </span>
      ),
    },

    {
      field: "docStatus",
      header: t("shared.docStatus"),
      body: (rowData) => (
        <span
          className={
            rowData.docStatus === "TODO"
              ? "badge bg-primary"
              : rowData.docStatus === "IN_PROGRESS"
              ? "badge bg-info"
              : rowData.docStatus === "IN_COMPLETE"
              ? "badge bg-warning"
              : rowData.docStatus === "DONE"
              ? "badge bg-success"
              : rowData.docStatus === "VIOLATION"
              ? "badge bg-danger"
              : ""
          }
        >
          {rowData.docStatus === "TODO"
            ? t("mainLayout.dashboard.todo")
            : rowData.docStatus === "IN_PROGRESS"
            ? t("mainLayout.dashboard.inprogress")
            : rowData.docStatus === "IN_COMPLETE"
            ? t("mainLayout.dashboard.incomplete")
            : rowData.docStatus === "DONE"
            ? t("mainLayout.dashboard.done")
            : rowData.docStatus === "VIOLATION"
            ? t("mainLayout.dashboard.violation")
            : rowData.docStatus}
        </span>
      ),
    },

    {
      field: "actions",
      header: t("shared.actions"),
      body: (rowData) => (
        <>
          <Tooltip
            target=".custom-view-icon"
            content={t("shared.details")}
            position="top"
          />
          <Link
            to={`/outgoing-documents/${rowData.sendDocId}`}
            className="ms-3"
          >
            <TbListDetails size={30} className="custom-view-icon" />
          </Link>
        </>
      ),
    },
  ];

  const exportColumns = [
    { title: t("shared.deadline"), dataKey: "deadline" },
    { title: t("shared.sendingDate"), dataKey: "sendingDate" },
    {
      title: t("report.action"),
      dataKey: "action",
    },
    {
      title: t("report.findings"),
      dataKey: "findings",
    },
    {
      title: t("report.organResponse"),
      dataKey: "targetOrganResponse",
    },
    { title: t("shared.receiver"), dataKey: "receiverDepartment" },
    { title: t("shared.docType"), dataKey: "docType" },
    { title: t("shared.subject"), dataKey: "subject" },
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
  const mapSendingStatus = (status) => {
    return status === "SEEN"
      ? t("shared.seen")
      : status === "PENDING"
      ? t("shared.pending")
      : status;
  };

  const mapSecret = (secret) => {
    return secret === "SECRET" ? t("shared.secret") : t("shared.noSecret");
  };

  const mapDocStatus = (docStatus) => {
    switch (docStatus) {
      case "TODO":
        return t("mainLayout.dashboard.todo");
      case "IN_PROGRESS":
        return t("mainLayout.dashboard.inprogress");
      case "IN_COMPLETE":
        return t("mainLayout.dashboard.incomplete");
      case "DONE":
        return t("mainLayout.dashboard.done");
      case "VIOLATION":
        return t("mainLayout.dashboard.violation");
      default:
        return "";
    }
  };

  const mapSenderDepartment = (depId) => {
    const department = departmentData.find((dep) => dep.depId === depId);
    return department ? department.depName : "";
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
      subject: englishToPersianDigits(row.subject),
      sendingStatus: mapSendingStatus(row.sendingStatus),
      secret: mapSecret(row.secret),
      docStatus: mapDocStatus(row.docStatus),
      receiverDepartment: row.receiverDepartments.depName,
      docType: mapDocType(row.docType),
      creationDate: formatDate(row.creationDate),
      deadline: formatDate(row.deadline),
      timeToSeen: formatDate(row.timeToSeen),
      sendingDate: formatDate(row.sendingDate),
      action: row.action || "-",
      findings: row.findings || "-",
      targetOrganResponse: row.targetOrganResponse || "-",
    }));
  };

  // For Filter Criteria Header
  const formatFilterValue = (key, value) => {
    switch (key) {
      case "documentType":
        return mapDocType(value);
      case "documentStatus":
        return mapDocStatus(value);
      case "sendingDateStart":
      case "sendingDateEnd":
        return formatDate(value);
      case "senderDepartmentIds":
        return mapSenderDepartment(value);
      default:
        return value;
    }
  };

  const mapFilterCriteria = (filters) => {
    const filterLabels = {
      documentNo: t("shared.docNum"),
      documentType: t("shared.docType"),
      documentStatus: t("shared.docStatus"),
      subject: t("shared.subject"),
      sendingDateStart: t("filter.startDate"),
      sendingDateEnd: t("filter.endDate"),
      senderDepartmentIds: t("shared.sender"),
      searchTerm: t("shared.searchTerm"),
    };

    return Object.entries(filters)
      .filter(([key, value]) => {
        if (key === "senderDepartmentIds") {
          return Array.isArray(value) && value.length > 0;
        }
        return value !== "";
      })
      .map(([key, value]) => {
        if (key === "senderDepartmentIds") {
          const depNames = value.map(
            (depId) => departmentData.find((dep) => dep.depId === depId).depName
          );
          return `${filterLabels[key]}: ${depNames.join(", ")}`;
        } else {
          return `${filterLabels[key]}: ${formatFilterValue(key, value)}`;
        }
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
          const modifiedData = prepareDataForExport(sentDocuments);
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
          doc.save("sent-documents-filtered-data.pdf");
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const data = prepareDataForExport(sentDocuments);

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

      saveAsExcelFile(excelBuffer, "sent-docs-filteredData");
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
      <h3>{t("document.sentDocuments.sentDocumentsList")}</h3>
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

  return (
    <>
      {/* <div className="row">
        <div className="col-12">
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
                  <Filter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    resetFilter={resetFilter}
                    isSentDocument={true}
                  />
                )}
              </div>
              <div className="card">
                {filterLoading ? (
                  <Spinner />
                ) : searchResultFound && sentDocuments.length === 0 ? (
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
                ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                      value={filteredDocuments}
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
                    <Pagination totalRecords={sentDocCounts.totalElements} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div> */}
      {/* <div className="row">
  <div className="col-12">
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
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              resetFilter={resetFilter}
              isSentDocument={true}
            />
          )}
        </div>
        <div
          className="card shadow-lg"
          style={{
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && sentDocuments.length === 0 ? (
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
          ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                value={filteredDocuments}
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
              <Pagination totalRecords={sentDocCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}



      {/* <div className="row">
  <div className="col-12">
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
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              resetFilter={resetFilter}
              isSentDocument={true}
            />
          )}
        </div>
        <div className="card shadow-lg border-0">
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && sentDocuments.length === 0 ? (
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
          ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                value={filteredDocuments}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
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
                      textAlign: "right",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                    headerClassName="bg-primary text-light"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div className="card-footer text-center bg-light">
              <Pagination totalRecords={sentDocCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}
{/* <div className="row">
  <div className="col-12">
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
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              resetFilter={resetFilter}
              isSentDocument={true}
            />
          )}
        </div>
        <div className="card shadow-lg border-0">
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && sentDocuments.length === 0 ? (
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
          ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                value={filteredDocuments}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
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
                      border: "1px solid #ccc",
                      margin: "5px", // Add space between fields
                      borderRadius: "4px", // Optional for rounded edges
                      backgroundColor: "#f9f9f9", // Light background for contrast
                    }}
                    headerClassName="bg-primary text-light"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div className="card-footer text-center bg-light">
              <Pagination totalRecords={sentDocCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}
{/* <div className="row">
  <div className="col-12">
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
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              resetFilter={resetFilter}
              isSentDocument={true}
            />
          )}
        </div>
        <div className="card shadow-lg border-0">
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && sentDocuments.length === 0 ? (
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
          ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                value={filteredDocuments}
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
              <Pagination totalRecords={sentDocCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}

{/* <div className="row">
  <div className="col-12">
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-3">
          <button
            className="btn btn-lg btn-info mb-3 shadow-sm"
            onClick={toggleFilter}
            style={{
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "20px", // Rounded corners for the button
            }}
          >
            {showFilter ? t("filter.hide") : t("filter.filter")}
          </button>
          {showFilter && (
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              resetFilter={resetFilter}
              isSentDocument={true}
            />
          )}
        </div>
        <div
          className="card shadow-lg"
          style={{
            border: "none", // No border
            borderRadius: "10px", // Rounded corners for the card
            backgroundColor: "#ffffff", // White background for the card
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for the card
          }}
        >
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && sentDocuments.length === 0 ? (
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
                  backgroundColor: "#fffae6", // Light yellow background
                }}
              >
                {t("document.sentDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                  backgroundColor: "#ffebe6", // Light pink background
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
                value={filteredDocuments}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  backgroundColor: "#f8f9fa", // Light gray background for the table
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
                      backgroundColor: "#ffffff", // White background for cells
                    }}
                    headerClassName="bg-primary text-light rounded"
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div
              className="card-footer text-center"
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa", // Light gray background for the footer
              }}
            >
              <Pagination totalRecords={sentDocCounts.totalElements} />
            </div>
          )}
        </div>
      </>
    )}
  </div>
</div> */}
<div className="row">
  <div className="col-12">
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-3">
          <button
            className="btn btn-lg btn-info mb-3 shadow-sm"
            onClick={toggleFilter}
            style={{
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "20px", // Rounded corners for the button
            }}
          >
            {showFilter ? t("filter.hide") : t("filter.filter")}
          </button>
          {showFilter && (
            <Filter
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              resetFilter={resetFilter}
              isSentDocument={true}
            />
          )}
        </div>
        <div
          className="card shadow-lg"
          style={{
            border: "none", // No border
            borderRadius: "10px", // Rounded corners for the card
            backgroundColor: "#ffffff", // White background for the card
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for the card
          }}
        >
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && sentDocuments.length === 0 ? (
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
                  backgroundColor: "#fffae6", // Light yellow background
                }}
              >
                {t("document.sentDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && sentDocuments.length === 0 ? (
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
                  backgroundColor: "#ffebe6", // Light pink background
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
                value={filteredDocuments}
                ref={dt}
                tableStyle={{
                  minWidth: "50rem",
                  backgroundColor: "#f8f9fa", // Light gray background for the table
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
                      backgroundColor: "#ffffff", // White background for cells
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow on fields
                    }}
                    headerClassName="bg-primary text-light" // No border-radius on header
                  />
                ))}
              </DataTable>
            </div>
          )}
          {searchResultFound && (
            <div
              className="card-footer text-center"
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa", // Light gray background for the footer
              }}
            >
              <Pagination totalRecords={sentDocCounts.totalElements} />
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

export default SentDocumentList;
