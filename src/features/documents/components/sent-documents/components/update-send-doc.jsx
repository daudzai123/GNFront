import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../../hooks/use-httpInterceptedService";

const UpdateSendDoc = ({ data, id, departmentOptions, handleUpdate }) => {
  const { t } = useTranslation();

  const httpInterceptedService = useHttpInterceptedService();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, touchedFields, isDirty },
  } = useForm({
    defaultValues: {
      guide: data.guide,
      secret: data.secret,
      documentId: data.documentId?.docId,
      docStatus: data.docStatus,
      receiverDepartment: data.receiverDepartment?.depId,
      senderDepartment: data.senderDepartment?.depId,
      sendOriginalDocument: data.sendOrginalDoc,
      sendAppendentDocuments: data.sendAppendentDocs,
    },
    mode: "onBlur",
  });

  // Update Send Document
  const onSubmit = async (data) => {
    if (!Array.isArray(data.receiverDepartment)) {
      data.receiverDepartment = [data.receiverDepartment];
    }
    const { ...sendDocumentData } = data;
    try {
      await httpInterceptedService.put(
        `/sendDocument/update/${id}`,
        sendDocumentData
      );
      toast.success(t("toast.editOperationSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      handleUpdate();
    } catch (error) {
      toast.error(t("toast.editOperationFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.receiver")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            name="receiverDepartment"
            control={control}
            rules={{
              required: t("department.validation.receiverDepartmentRequired"),
            }}
            render={({ field }) => (
              <Dropdown
                optionLabel="label"
                optionValue="value"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                filter
                options={departmentOptions}
                placeholder={t("filter.chooseReceiver")}
                style={{ width: "100%" }}
                className={`w-full md:w-14rem" ${
                  errors.receiverDepartment ? "p-invalid" : ""
                }`}
              />
            )}
          />
          {errors.receiverDepartment && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.receiverDepartment?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.guide")}
        </label>
        <div className="col-md-8 col-lg-9">
          <textarea
            {...register("guide", {
              required: t("document.validation.docguideRequired"),
            })}
            className={`form-control form-control-lg ${
              errors.guide
                ? "is-invalid"
                : touchedFields.guide
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors.guide && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.guide?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.secrecy")}
        </label>
        <div className="col-md-8 col-lg-9">
          <div className="d-flex">
            <label className="form-check ms-3">
              <input
                {...register("secret", {
                  required: t("document.validation.secretnessRequired"),
                })}
                className="form-check-input"
                type="radio"
                value="SECRET"
              />
              <span className="form-check-label">{t("shared.secret")}</span>
            </label>
            <label className="form-check">
              <input
                {...register("secret", {
                  required: t("document.validation.secretnessRequired"),
                })}
                className="form-check-input"
                type="radio"
                value="NON_SECRET"
              />
              <span className="form-check-label">{t("shared.nonSecret")}</span>
            </label>
            {errors.secret && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.secret?.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.mainDoc")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            type="checkbox"
            id="mainDocument"
            name="mainDocument"
            className="form-check-input ms-2"
            {...register("sendOriginalDocument")}
          />
          <label className="form-check-label" htmlFor="mainDocument">
            {t("shared.send")}
          </label>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.appendants")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            type="checkbox"
            id="appendant"
            name="appendant"
            className="form-check-input ms-2"
            {...register("sendAppendentDocuments")}
          />
          <label htmlFor="appendant">{t("shared.send")}</label>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button
          type="butoon"
          disabled={!isDirty}
          className="btn btn-lg btn-outline-dark ms-2"
          onClick={() => reset()}
        >
          {t("filter.cancel")}
        </button>
        <button
          type="submit"
          disabled={!isDirty}
          className="btn btn-lg btn-primary"
        >
          {t("shared.edit")}
        </button>
      </div>
    </form>
  );
};

export default UpdateSendDoc;
