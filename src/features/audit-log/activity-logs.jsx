import { Tooltip } from "primereact/tooltip";
import useAxios from "@core/useAxios";
import Loading from "../../components/loading";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/pagination";
import emptyFolder from "../../assets/images/emptyFolder.jpeg";
import { useTranslation } from "react-i18next";

const ActivityLogs = () => {
  const { t } = useTranslation();
  const dt = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/ActivityLog/all";
  url += `?page=${page}&size=${size}`;

  const [logs, , loading] = useAxios({
    url: url,
  });

  const renderContent = () => {
    if (loading) {
      return <Loading theme="primary" />;
    }

    const columns = [
      { field: "entityName", header: t("logs.entity") },
      { field: "recordId", header: t("logs.record") },
      { field: "action", header: t("logs.action") },
      {
        field: "content",
        header: t("logs.content"),
        body: (rowData) => <span>{rowData.content || "-"}</span>,
      },
      {
        field: "timestamp",
        header: t("logs.time"),
        body: (rowData) => (
          <span>
            {new Date(rowData.timestamp)
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
      { field: "userName", header: t("logs.user") },
      { field: "departmentName", header: t("logs.department") },
    ];

    const exportColumns = [
      { title: t("logs.department"), dataKey: "departmentName" },
      { title: t("logs.user"), dataKey: "userName" },
      { title: t("logs.time"), dataKey: "timestamp" },
      { title: t("logs.content"), dataKey: "content" },
      { title: t("logs.action"), dataKey: "action" },
      { title: t("logs.record"), dataKey: "recordId" },
      { title: t("logs.entity"), dataKey: "entityName" },
    ];

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
      if (!data || !Array.isArray(data.content)) return [];
      return data.content.map((row) => ({
        ...row,
        timestamp: formatDate(row.timestamp),
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
            const modifiedData = prepareDataForExport(logs);
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
            doc.save("system-activity-logs.pdf");
          } catch (error) {
            console.error("خطا:", error);
          }
        });
      });
    };

    const exportExcel = () => {
      import("xlsx").then((xlsx) => {
        const data = prepareDataForExport(logs);

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

        saveAsExcelFile(excelBuffer, "system-activity-logs");
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
      <div className="d-flex align-items-center justify-content-between" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <h3>{t("logs.logsTitle")}</h3>
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
        <div className="card" style={{ overflowX: "auto" }}>
          {logs && logs.length === 0 ? (
            <div className="card" style={{ height: "100%" }}>
              <div className="text-center">
                <img src={emptyFolder} alt="Empty Folder" width={100} />
              </div>
              <p
                className="alert-warning text-center mt-3"
                style={{ width: "100%" }}
              >
                {t("logs.emptyList")}
              </p>
            </div>
          ) : (
            <>
              <div className="card-body">
                <Tooltip target=".export-excel-button" position="top" />
                <Tooltip target=".export-pdf-button" position="top" />
                <DataTable
                  value={logs.content}
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
            </>
          )}
          {logs.content?.length > 0 && (
            <div className="card-footer">
              <Pagination totalRecords={logs.totalElements} />
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="row" style={{ height: "auto" }}>
        <div className="col-12">{renderContent()}</div>
      </div>
    </>
  );
};

export default ActivityLogs;
