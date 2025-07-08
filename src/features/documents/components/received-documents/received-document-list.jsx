import { Tooltip } from "primereact/tooltip";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { lazy, useEffect, useRef, useState } from "react";
import useAuth from "../../../hooks/use-auth";
const Filter = lazy(() => import("../../../../components/filter"));
import notfound from "@assets/images/notfound.jpeg";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import Pagination from "../../../../components/pagination";
import { TbListDetails } from "react-icons/tb";
import Spinner from "../../../../components/spinner";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import Loading from "../../../../components/loading";
import useAuthToken from "../../../hooks/use-authToken";
import {
  englishToPersianDigits,
  persianToEnglishDigits,
} from "../../../../components/convert-digits";

const ReceivedDocumentList = () => {
  const { t, i18n } = useTranslation();
  const { auth } = useAuth();
  const { authToken } = useAuthToken();
  const dt = useRef(null);
  const httpInterceptedService = useHttpInterceptedService();
  const [receivedDocuments, setReceivedDocuments] = useState([]);
  const [receivedDocCounts, setReceivedDocCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchResultFound, setSearchResultsFound] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Fetch Received Documents Data
  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/sendDocument/filter";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getReceivedDocuments = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setReceivedDocuments(response.data?.content);
      setReceivedDocCounts(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    getReceivedDocuments();
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
    referenceType: "",
    subject: "",
    sendingDateStart: "",
    sendingDateEnd: "",
    receiverDepartmentIds: [],
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
        `/sendDocument/filter2?${queryString}`
      );
      if (response && response.data.length > 0) {
        setReceivedDocuments(response.data);
        setSearchResultsFound(true);
      } else {
        setReceivedDocuments([]);
        setSearchResultsFound(false);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  const resetFilter = () => {
    getReceivedDocuments();
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
      receiverDepartmentIds: [],
      searchTerm: "",
    });
  };

  // Filter sentDocuments based on role to view secret documents
  const filteredDocuments = authToken?.roles.includes("secret_view")
    ? receivedDocuments
    : receivedDocuments.filter((doc) => doc.secret !== "SECRET");

  // For DataTable and Export
  const isCommitteeMember = auth?.userType === "MEMBER_OF_COMMITTEE";
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
      field: "senderDepartment",
      header: t("shared.sender"),
      body: (rowData) =>
        rowData.senderDepartment ? rowData.senderDepartment.depName : "",
    },
    isCommitteeMember && {
      field: "receiverDepartments",
      header: t("shared.receiver"),
      body: (rowData) =>
        rowData.receiverDepartments ? rowData.receiverDepartments.depName : "",
    },
    {
      field: "docType",
      header: t("shared.docType"),
      body: (rowData) => (
        <span>
          {rowData.docType === "HUKAM"
            ? t("filter.hukam")
            : rowData.docType === "FARMAN"
            ? t("filter.farman")
            : rowData.docType === "MUSAWWIBA"
            ? t("filter.musawiba")
            : rowData.docType === "HIDAYAT"
            ? t("filter.hidayat")
            : t("filter.report")}
        </span>
      ),
    },
    {
      field: "sendingDate",
      header: t("shared.receivedDate"),
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
            rowData.secret === "SECRET" ? "badge bg-danger" : "badge bg-primary"
          }
        >
          {rowData.secret === "SECRET"
            ? t("shared.secret")
            : t("shared.nonSecret")}
        </span>
      ),
    },
    {
      field: "sendingStatus",
      header: t("shared.sendingStatus"),
      body: (rowData) => (
        <span
          className={
            rowData.sendingStatus === "PENDING"
              ? "badge bg-warning"
              : "badge bg-success"
          }
        >
          {rowData.sendingStatus === "PENDING"
            ? t("shared.pending")
            : t("shared.seen")}
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
            : ""}
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
            to={`/incoming-documents/${rowData.sendDocId}`}
            className="ms-3"
          >
            <TbListDetails size={30} className="custom-view-icon" />
          </Link>
        </>
      ),
    },
  ].filter(Boolean);

  const exportColumns = [
    { title: t("shared.receivedDate"), dataKey: "sendingDate" },
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
    { title: t("shared.reference"), dataKey: "referenceType" },
    { title: t("shared.sender"), dataKey: "senderDepartment" },
    isCommitteeMember && {
      title: t("shared.receiver"),
      dataKey: "receiverDepartments",
    },
    { title: t("shared.docType"), dataKey: "docType" },
    { title: t("shared.subject"), dataKey: "subject" },
    { title: t("shared.docNum"), dataKey: "docNumber" },
    { title: t("shared.number"), dataKey: "incrementalNumber" },
  ].filter(Boolean);

  const mapReferenceType = (type) => {
    return type === "AMIR"
      ? t("filter.leader")
      : type === "RAYESULWOZARA"
      ? t("filter.rayesulwozara")
      : type;
  };

  const mapDocType = (type) => {
    return type === "FARMAN"
      ? t("filter.farman")
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
    return secret === "SECRET" ? t("shared.secret") : t("shared.nonSecret");
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

  const mapReceiverDepartment = (depId) => {
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
    const isCommitteeMember = auth?.userType === "MEMBER_OF_COMMITTEE";

    return data.map((row, index) => {
      const rowData = {
        ...row,
        incrementalNumber: englishToPersianDigits((index + 1).toString()),
        docNumber: englishToPersianDigits(row.docNumber),
        subject: englishToPersianDigits(row.subject),
        sendingStatus: mapSendingStatus(row.sendingStatus),
        secret: mapSecret(row.secret),
        docStatus: mapDocStatus(row.docStatus),
        senderDepartment: row.senderDepartment.depName,
        receivedDocuments: row.receiverDepartments.depName,
        docType: mapDocType(row.docType),
        sendingDate: formatDate(row.sendingDate),
        referenceType: mapReferenceType(row.referenceType) || "-",
        action: row.action || "-",
        findings: row.findings || "-",
        targetOrganResponse: row.targetOrganResponse || "-",
      };

      if (isCommitteeMember) {
        rowData.receiverDepartments = row.receiverDepartments
          ? row.receiverDepartments.depName
          : "";
      }

      return rowData;
    });
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
      case "receiverDepartmentIds":
        return mapReceiverDepartment(value);
      case "referenceType":
        return mapReferenceType(value);
      default:
        return value;
    }
  };

  const mapFilterCriteria = (filters) => {
    const filterLabels = {
      documentNo: t("shared.docNum"),
      documentType: t("shared.docType"),
      documentStatus: t("shared.docStatus"),
      referenceType: t("shared.reference"),
      subject: t("shared.subject"),
      sendingDateStart: t("filter.startDate"),
      sendingDateEnd: t("filter.endDate"),
      receiverDepartmentIds: t("shared.receiver"),
      searchTerm: t("shared.searchTerm"),
    };

    return Object.entries(filters)
      .filter(([key, value]) => {
        if (key === "receiverDepartmentIds") {
          return Array.isArray(value) && value.length > 0;
        }
        return value !== "";
      })
      .map(([key, value]) => {
        if (key === "receiverDepartmentIds") {
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
          const modifiedData = prepareDataForExport(receivedDocuments);
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
            },
            columnStyles: {
              cellWidth: "auto",
            },
          });
          doc.save("received-documents-filtered-data.pdf");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const data = prepareDataForExport(receivedDocuments);

      const worksheetData = data.map((row) =>
        exportColumns.map((col) => row[col.dataKey])
      );

      const worksheet = xlsx.utils.aoa_to_sheet([
        mapFilterCriteria(filters),
        exportColumns.map((col) => col.title),
        ...worksheetData,
      ]);

      const headerStyles = {
        fill: {
          fgColor: { rgb: "FF0000" },
        },
        font: {
          color: { rgb: "FFFFFF" },
          bold: true,
        },
      };

      Object.keys(headerStyles).forEach((key) => {
        worksheet["!cols"] = [{ width: 30 }];
        worksheet["!merges"] = [];
        worksheet["!rows"] = [];
        worksheet["!merges"].push({
          s: { r: 0, c: 0 },
          e: { r: 0, c: exportColumns.length - 1 },
        });
        worksheet["!rows"].push({ hpt: 20 });

        worksheet["!cols"] = exportColumns.map(() => ({ wch: 20 }));

        if (key === "fill") {
          Object.keys(headerStyles[key]).forEach((property) => {
            headerStyles[key][property] = { ...headerStyles[key][property] };
          });
        }
      });

      worksheet["!rows"][0] = {
        ...worksheet["!rows"][0],
        s: {
          ...worksheet["!rows"][0].s,
          ...headerStyles,
        },
      };

      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };

      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
        compression: true,
      });

      saveAsExcelFile(excelBuffer, "received-docs-filteredData");
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
      <h3>{t("document.receivedDocuments.receivedDocumentsList")}</h3>
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
      {/* <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <>
              <div className="mb-3">
                <button className="btn btn-lg btn-info mb-3" onClick={toggleFilter}>
                  {showFilter ? t("filter.hide") : t("filter.filter")}
                </button>
                {showFilter && (
                  <Filter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    resetFilter={resetFilter}
                    isSentDocument={false}
                  />
                )}
              </div>
              <div className="card">
                {filterLoading ? (
                  <Spinner />
                ) : searchResultFound && receivedDocuments.length === 0 ? (
                  <div className="card-body" style={{ height: "100%" }}>
                    <div className="text-center">
                      <img src={emptyFolder} alt="Empty Folder" width={100} />
                    </div>
                    <p
                      className="alert-warning text-center mt-3"
                      style={{ width: "100%" }}
                    >
                      {t("document.receivedDocuments.emptyList")}
                    </p>
                  </div>
                ) : !searchResultFound && receivedDocuments.length === 0 ? (
                  <div className="card-body" style={{ height: "100%" }}>
                    <div className="text-center">
                      <img src={notfound} alt="Not Found" width={100} />
                    </div>
                    <p className="alert-warning text-center mt-3">
                      {t("shared.notFound")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="card-body" style={{ height: "100%" }}>
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
                    {searchResultFound && (
                      <div className="card-footer">
                        <Pagination
                          totalRecords={receivedDocCounts.totalElements}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div> */}
      {/* <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
  <div className="col-12">
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-3">
          <button
            className="btn btn-lg btn-info mb-3 shadow-lg"
            onClick={toggleFilter}
            style={{
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Large shadow for button
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
              isSentDocument={false}
            />
          )}
        </div>
        <div
          className="card shadow-lg"
          style={{
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for card
          }}
        >
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && receivedDocuments.length === 0 ? (
            <div className="card-body text-center" style={{ height: "100%" }}>
              <img src={emptyFolder} alt="Empty Folder" width={100} />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fffae6",
                  borderRadius: "8px", // Rounded corners for message
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for message
                }}
              >
                {t("document.receivedDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && receivedDocuments.length === 0 ? (
            <div className="card-body text-center" style={{ height: "100%" }}>
              <img src={notfound} alt="Not Found" width={100} />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  padding: "10px",
                  backgroundColor: "#ffebe6",
                  borderRadius: "8px", // Rounded corners for message
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for message
                }}
              >
                {t("shared.notFound")}
              </p>
            </div>
          ) : (
            <>
              <div className="card-body" style={{ height: "100%" }}>
                <Tooltip target=".export-excel-button" position="top" />
                <Tooltip target=".export-pdf-button" position="top" />
                <DataTable
                  value={filteredDocuments}
                  ref={dt}
                  tableStyle={{
                    minWidth: "50rem",
                    backgroundColor: "#f8f9fa",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for table
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
                        padding: "15px",
                        borderRadius: "8px", // Rounded corners for fields
                        backgroundColor: "#ffffff",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for fields
                      }}
                      headerClassName="bg-primary text-light rounded"
                    />
                  ))}
                </DataTable>
              </div>
              {searchResultFound && (
                <div
                  className="card-footer text-center"
                  style={{
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderTop: "1px solid #ddd",
                    borderRadius: "0 0 10px 10px", // Rounded corners for footer
                  }}
                >
                  <Pagination totalRecords={receivedDocCounts.totalElements} />
                </div>
              )}
            </>
          )}
        </div>
      </>
    )}
  </div>
</div> */}
<div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
  <div className="col-12">
    {loading ? (
      <Loading theme="primary" />
    ) : (
      <>
        <div className="mb-3">
          <button
            className="btn btn-lg btn-info mb-3 shadow-lg"
            onClick={toggleFilter}
            style={{
              fontWeight: "bold",
              padding: "10px 20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Large shadow for button
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
              isSentDocument={false}
            />
          )}
        </div>
        <div
          className="card shadow-lg"
          style={{
            border: "none",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for card
          }}
        >
          {filterLoading ? (
            <Spinner />
          ) : searchResultFound && receivedDocuments.length === 0 ? (
            <div className="card-body text-center" style={{ height: "100%" }}>
              <img src={emptyFolder} alt="Empty Folder" width={100} />
              <p
                className="alert-warning text-center mt-3"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fffae6",
                }}
              >
                {t("document.receivedDocuments.emptyList")}
              </p>
            </div>
          ) : !searchResultFound && receivedDocuments.length === 0 ? (
            <div className="card-body text-center" style={{ height: "100%" }}>
              <img src={notfound} alt="Not Found" width={100} />
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
            <>
              <div className="card-body" style={{ height: "100%" }}>
                <Tooltip target=".export-excel-button" position="top" />
                <Tooltip target=".export-pdf-button" position="top" />
                <DataTable
                  value={filteredDocuments}
                  ref={dt}
                  tableStyle={{
                    minWidth: "50rem",
                    backgroundColor: "#f8f9fa",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for table
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
                        padding: "15px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Large shadow for fields
                      }}
                      headerClassName="bg-primary text-light"
                    />
                  ))}
                </DataTable>
              </div>
              {searchResultFound && (
                <div
                  className="card-footer text-center"
                  style={{
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <Pagination totalRecords={receivedDocCounts.totalElements} />
                </div>
              )}
            </>
          )}
        </div>
      </>
    )}
  </div>
</div>

    </>
  );
};

export default ReceivedDocumentList;
