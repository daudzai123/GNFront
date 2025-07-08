import useAxios from "@core/useAxios";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import Loading from "../../../../components/loading";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../../../components/pagination";
import { Column } from "primereact/column";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { useTranslation } from "react-i18next";

const ExpiredDocuments = () => {
  const { t } = useTranslation();
  const dt = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/sendDocument/ExpiredDocuments";
  url += `?page=${page}&size=${size}`;

  const [expiredDocuments, , loading] = useAxios({
    url: url,
  });

  const renderContent = () => {
    if (loading) {
      return <Loading theme="primary" />;
    }

    // For Expired Docs DataTable
    const columns = [
      { field: "docNumber", header: t("shared.docNum") },
      { field: "subject", header: t("shared.subject") },
      {
        field: "secret",
        header: t("shared.secrecy"),
        body: (rowData) => (
          <span
            className={
              rowData.secret === "SECRET"
                ? "badge bg-danger"
                : "badge bg-primary"
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
        header: t("shared.docStatus"),
        body: (rowData) => (
          <span
            className={
              rowData.sendingStatus === "SEEN"
                ? "badge bg-success"
                : "badge bg-warning"
            }
          >
            {rowData.sendingStatus === "SEEN"
              ? t("shared.seen")
              : t("shared.pending")}
          </span>
        ),
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
        field: "deadline",
        header: t("shared.deadline"),
        body: (rowData) => (
          <span>
            {new Date(rowData.deadline)
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
    ];

    const exportColumns = [
      { title: t("shared.deadline"), dataKey: "deadline" },
      { title: t("shared.sendingDate"), dataKey: "sendingDate" },
      { title: t("shared.sendingStatus"), dataKey: "sendingStatus" },
      { title: t("shared.secrecy"), dataKey: "secret" },
      { title: t("shared.subject"), dataKey: "subject" },
      { title: t("shared.docNum"), dataKey: "docNumber" },
    ];

    const mapSecret = (secret) => {
      switch (secret) {
        case "SECRET":
          return t("shared.secret");
        case "NON_SECRET":
          return t("shared.nonSecret");
        default:
          return "";
      }
    };

    const mapSendingStatus = (sendingStatus) => {
      switch (sendingStatus) {
        case "SEEN":
          return t("shared.seen");
        case "PENDING":
          return t("shared.pending");
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
        secret: mapSecret(row.secret),
        sendingStatus: mapSendingStatus(row.sendingStatus),
        sendingDate: formatDate(row.sendingDate),
        deadline: formatDate(row.deadline),
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
            const modifiedData = prepareDataForExport(expiredDocuments.content);
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
            doc.save("expiredDocs.pdf");
          } catch (error) {
            console.error("خطا:", error);
          }
        });
      });
    };

    const exportExcel = () => {
      import("xlsx").then((xlsx) => {
        const data = prepareDataForExport(expiredDocuments.content);

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

        saveAsExcelFile(excelBuffer, "ExpiredDocs");
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
        <h3>{t("document.expiredDocumentList")}</h3>
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
        {expiredDocuments.content?.length > 0 ? (
          <div className="card">
            <div className="card-body">
              <Tooltip target=".export-excel-button" position="top" />
              <Tooltip target=".export-pdf-button" position="top" />
              <DataTable
                value={expiredDocuments.content}
                ref={dt}
                tableStyle={{ minWidth: "50rem" }}
                header={header}
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
            <div className="card-footer">
              <Pagination totalRecords={expiredDocuments.totalElements} />
            </div>
          </div>
        ) : (
          <div className="card">
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
        )}
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

export default ExpiredDocuments;
