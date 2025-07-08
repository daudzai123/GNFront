import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { MultiSelect } from "primereact/multiselect";

const SendDocument = ({ data, departmentOptions }) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();
  const [selectedDepartments, setSelectedDepartments] = useState(null);

  const {
    control: control2,
    register: register2,
    reset: resetSend,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm({
    defaultValues: {
      documentId: data.docId,
      sendingStatus: "PENDING",
    },
  });

  // Send Document
  const onSubmitSendDocument = async (data) => {
    const { ...sendDocumentData } = data;
    try {
      await httpInterceptedService.post("/sendDocument/add", sendDocumentData);
      toast.success(t("toast.sendDocSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      resetSend();
      setSelectedDepartments(null);
    } catch (error) {
      toast.error(t("toast.sendDocFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  // MultiSelect
  const departmentTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };
  const panelFooterTemplate = () => {
    const length = selectedDepartments ? selectedDepartments.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> {t("department.departmentSelected")}
      </div>
    );
  };

  return (
    <form key={2} onSubmit={handleSubmit2(onSubmitSendDocument)} style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.receiver")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            name="receiverDepartment"
            control={control2}
            rules={{
              required: t("document.validation.requiredField"),
            }}
            render={({ field }) => (
              <MultiSelect
                value={selectedDepartments}
                onChange={(e) => {
                  setSelectedDepartments(e.value);
                  field.onChange(e.value);
                }}
                options={departmentOptions}
                optionLabel="label"
                display="chip"
                filter
                placeholder={t("filter.chooseReceiver")}
                itemTemplate={departmentTemplate}
                panelFooterTemplate={panelFooterTemplate}
                style={{ width: "100%" }}
                className={`w-full md:w-20rem ${
                  errors2.receiverDepartment ? "p-invalid" : ""
                }`}
              />
            )}
          />
          {errors2.receiverDepartment && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.receiverDepartment?.message}
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
            {...register2("guide", {
              required: t("document.validation.requiredField"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control ${errors2.guide && "is-invalid"}`}
            autoComplete="off"
          />
          {errors2.guide && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.guide?.message}
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
                type="radio"
                {...register2("secret", {
                  required: t("document.validation.secretnessRequired"),
                })}
                className="form-check-input"
                value="SECRET"
              />
              <span className="form-check-label">{t("shared.secret")}</span>
            </label>
            <label className="form-check">
              <input
                {...register2("secret", {
                  required: t("document.validation.secretnessRequired"),
                })}
                type="radio"
                className="form-check-input"
                value="NON_SECRET"
                defaultChecked
              />
              <span className="form-check-label">{t("shared.nonSecret")}</span>
            </label>
            {errors2.secret && (
              <p className="text-danger small fw-bolder mt-1">
                {errors2.secret?.message}
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
            {...register2("sendOriginalDocument")}
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
            {...register2("sendAppendentDocuments")}
          />
          <label htmlFor="appendant">{t("shared.send")}</label>
        </div>
      </div>
      <div className="text-center d-flex justify-content-end">
        <button type="submit" className="btn btn-lg btn-primary">
          {t("shared.sendDocument")}
        </button>
      </div>
    </form>
  );
};

export default SendDocument;
