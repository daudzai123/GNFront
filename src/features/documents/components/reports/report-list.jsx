import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { TbFileReport } from "react-icons/tb";
import { Column } from "primereact/column";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

const ReportList = ({ reports }) => {
  const { t } = useTranslation();
  const dt = useRef(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // View Document File
  const getDocument = (url) => {
    window.open(url, "_blank");
  };

  // For Roport DataTable
  const columns = [
    { field: "docReportId", header: t("shared.number") },
    {
      field: "date",
      header: t("shared.date"),
      body: (rowData) => (
        <span>
          {new Date(rowData.date)
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
    { field: "reportTitle", header: t("report.title") },
    { field: "departmentCreatedBy", header: t("report.reporter") },
    {
      field: "targetOrganResponse",
      header: t("report.organResponse"),
    },
    {
      field: "findings",
      header: t("report.findings"),
      body: (rowData) => (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(rowData.findings),
          }}
        />
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
      field: "action",
      header: t("report.action"),
      body: (rowData) => (rowData.action ? rowData.action : "-"),
    },
    {
      field: "actions",
      header: t("report.attachment"),
      body: (rowData) => (
        <>
          <Tooltip
            target=".custom-view-icon"
            content={t("shared.viewDoc")}
            position="top"
          />
          {rowData.downloadUrl ? (
            <Link
              onClick={() => getDocument(`${BASE_URL}${rowData.downloadUrl}`)}
              className="ms-3"
            >
              <TbFileReport size={25} className="custom-view-icon" />
            </Link>
          ) : (
            "-"
          )}
        </>
      ),
    },
  ];

  const exportColumns = [
    reports.docStatus === "VIOLATION" && {
      title: t("report.action"),
      dataKey: "action",
    },
    { title: t("shared.docStatus"), dataKey: "docStatus" },
    { title: t("report.findings"), dataKey: "findings" },
    { title: t("report.organResponse"), dataKey: "targetOrganResponse" },
    { title: t("report.reporter"), dataKey: "departmentCreatedBy" },
    { title: t("report.title"), dataKey: "reportTitle" },
    { title: t("shared.date"), dataKey: "date" },
    { title: t("shared.number"), dataKey: "docReportId" },
  ];

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
    return data.map((row) => ({
      ...row,
      docStatus: mapDocStatus(row.docStatus),
      date: formatDate(row.date),
      findings: DOMPurify.sanitize(row.findings, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      }),
    }));
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
          const modifiedData = prepareDataForExport(reports);
          const body = modifiedData.map((row) =>
            exportColumns.map((col) => row[col.dataKey])
          );
          doc.autoTable({
            head: [exportColumns.map((col) => col.title)],
            body: body,
            styles: {
              font: "BahijHelvetica",
              fontStyle: "normal",
              halign: "right",
              cellPadding: 3,
            },
          });
          doc.save("reports.pdf");
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const data = prepareDataForExport(reports);

      const worksheetData = data.map((row) =>
        exportColumns.map((col) => row[col.dataKey])
      );

      const worksheet = xlsx.utils.aoa_to_sheet([
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

      saveAsExcelFile(excelBuffer, "Reports");
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
    <div className="d-flex align-items-center justify-content-between">
      <h3>{t("report.reportList")}</h3>
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
      {reports ? (
        <div className="card">
          <div className="card-body">
            <Tooltip target=".export-excel-button" position="top" />
            <Tooltip target=".export-pdf-button" position="top" />
            <DataTable
              value={reports}
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
        </div>
      ) : (
        <div>{t("logs.emptyList")}</div>
      )}
    </>
  );
};

export default ReportList;
