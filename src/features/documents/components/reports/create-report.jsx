import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { Editor } from "primereact/editor";
import DOMPurify from "dompurify";

const CreateReport = ({ id, setAddReport }) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();

  // Create and Fetch Reports
  const {
    control: control2,
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    watch,
    formState: {
      isSubmitting: isSubmitting2,
      errors: errors2,
      touchedFields: touchedFields2,
    },
  } = useForm({
    defaultValues: {},
    mode: "onBlur",
  });

  const onSubmitReport = async (data) => {
    const formData = new FormData();
    const sanitizedFindings = DOMPurify.sanitize(data.findings);
    const docReportRequestDTO = {
      reportTitle: data.reportTitle,
      targetOrganResponse: data.targetOrganResponse,
      action: data.action,
      docStatus: data.docStatus,
      findings: sanitizedFindings,
      sendDocId: id,
    };
    formData.append(
      "docReportRequestDTO",
      new Blob([JSON.stringify(docReportRequestDTO)], {
        type: "application/json",
      })
    );
    formData.append("docReportFile", data.docReportFile[0]);

    try {
      await httpInterceptedService.post("/DocumentReport/add", formData);
      reset2();
      setAddReport();
      toast.success(t("toast.reportAddSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.reportAddFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit2(onSubmitReport)}
      encType="multipart/form-data"
      style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}
    >
      <div className="row mb-3">
        <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
          <label className="form-label">{t("report.title")}</label>
          <input
            type="text"
            {...register2("reportTitle", {
              required: t("document.validation.requiredField"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors2.reportTitle
                ? "is-invalid"
                : touchedFields2.reportTitle
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors2.reportTitle && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.reportTitle?.message}
            </p>
          )}
        </div>
        <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
          <label className="form-label">{t("report.organResponse")}</label>
          <textarea
            rows={5}
            {...register2("targetOrganResponse", {
              required: t("document.validation.requiredField"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors2.targetOrganResponse
                ? "is-invalid"
                : touchedFields2.targetOrganResponse
                ? "is-valid"
                : ""
            }`}
          />
          {errors2.targetOrganResponse && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.targetOrganResponse?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 col-md-12 col-lg-12 mx-auto d-table h-100">
          <label className="form-label">{t("report.findings")}</label>
          <Controller
            name="findings"
            control={control2}
            render={({ field }) => (
              <Editor
                value={field.value}
                onTextChange={(e) => field.onChange(e.htmlValue)}
                style={{ height: "320px" }}
              />
            )}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
          <label className="form-label">{t("shared.docStatus")}</label>
          <select
            {...register2("docStatus", {
              required: t("document.validation.requiredField"),
            })}
            className={`form-select form-select-lg ${
              errors2.docStatus
                ? "is-invalid"
                : touchedFields2.docStatus
                ? "is-valid"
                : ""
            }`}
          >
            <option value={""}>{t("filter.chooseDocStatus")}</option>
            <option value="IN_PROGRESS">
              {t("mainLayout.dashboard.inprogress")}
            </option>
            <option value="DONE">{t("mainLayout.dashboard.done")}</option>
            <option value="IN_COMPLETE">
              {t("mainLayout.dashboard.incomplete")}
            </option>
            <option value="VIOLATION">
              {t("mainLayout.dashboard.violation")}
            </option>
          </select>
          {errors2.docStatus && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.docStatus?.message}
            </p>
          )}
        </div>

        {watch("docStatus") === "VIOLATION" ||
        watch("docStatus") === "IN_COMPLETE" ? (
          <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
            <label className="form-label">{t("report.action")}</label>
            <textarea
              rows={5}
              {...register2("action", {
                required: t("document.validation.requiredField"),
                pattern: {
                  value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
                  message: t("register.validation.inputPattern"),
                },
              })}
              className={`form-control form-control-lg ${
                errors2.action
                  ? "is-invalid"
                  : touchedFields2.action
                  ? "is-valid"
                  : ""
              }`}
            />
            {errors2.action && (
              <p className="text-danger small fw-bolder mt-1">
                {errors2.action?.message}
              </p>
            )}
          </div>
        ) : (
          <div className="col"></div>
        )}
      </div>

      <div className="row mb-3">
        <div className="col-sm-10 col-md-6 col-lg-6 mx-auto d-table h-100">
          <label className="form-label mx-3">{t("report.attachment")}</label>
          <input
            type="file"
            className="form-control form-control-lg"
            {...register2("docReportFile")}
          />
        </div>
        <div className="col"></div>
      </div>
      <div className="mt-3 float-start">
        <button
          type="button"
          className="btn btn-lg btn-outline-dark mx-2"
          onClick={() => reset2()}
        >
          {t("shared.clear")}
        </button>
        <button
          type="submit"
          className="btn btn-lg btn-primary"
          disabled={isSubmitting2}
        >
          {isSubmitting2 ? t("report.submitting") : t("report.submitReport")}
        </button>
      </div>
    </form>
  );
};

export default CreateReport;
