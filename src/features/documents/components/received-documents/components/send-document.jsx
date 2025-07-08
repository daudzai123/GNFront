import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { MultiSelect } from "primereact/multiselect";
import useHttpInterceptedService from "../../../../hooks/use-httpInterceptedService";

const SendDocument = ({ data, departmentOptions }) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();

  const {
    control,
    register,
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      documentId: data.documentId?.docId,
      sendingStatus: "PENDING",
      parentSendDoc: data.sendDocId,
    },
  });

  // Send Document
  const onSubmit = async (data) => {
    const { ...sendDocumentData } = data;
    try {
      await httpInterceptedService.post("/sendDocument/add", sendDocumentData);
      reset();
      toast.success(t("toast.sendDocSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.sendDocFailure"), {
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
              required: t("document.validation.requiredField"),
            }}
            render={({ field }) => (
              <MultiSelect
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.value);
                }}
                options={departmentOptions}
                optionLabel="label"
                display="chip"
                filter
                placeholder={t("filter.chooseReceiver")}
                style={{ width: "100%" }}
                className={`w-full md:w-20rem ${
                  errors.receiverDepartment ? "p-invalid" : ""
                }`}
              />
            )}
          />
          {errors.receiverDepartment &&
            errors.receiverDepartment.type === "required" && (
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
            rows={3}
            {...register("guide", {
              required: t("document.validation.requiredField"),
            })}
            className={`form-control ${errors.guide && "is-invalid"}`}
            autoComplete="off"
          />
          {errors.guide && errors.guide.type === "required" && (
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
                {...register("secret")}
                className="form-check-input"
                type="radio"
                value="SECRET"
              />
              <span className="form-check-label">{t("shared.secret")}</span>
            </label>
            <label className="form-check">
              <input
                {...register("secret")}
                className="form-check-input"
                type="radio"
                value=" NON_SECRET"
                defaultChecked
              />
              <span className="form-check-label">{t("shared.nonSecret")}</span>
            </label>
            {errors.secret && errors.secret.type === "required" && (
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
            defaultChecked
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
            defaultChecked
            {...register("sendAppendentDocuments")}
          />
          <label htmlFor="appendant">{t("shared.send")}</label>
        </div>
      </div>
      <div className="text-center d-flex justify-content-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? t("register.saving") : t("shared.sendDocument")}
        </button>
      </div>
    </form>
  );
};

export default SendDocument;
