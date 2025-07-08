import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import gregorian from "react-date-object/calendars/gregorian";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";
import { Editor } from "primereact/editor";
import DOMPurify from "dompurify";
import {
  persianToEnglishDigits,
  englishToPersianDigits,
} from "../../../../components/convert-digits";

const UpdateDocument = ({
  data,
  userDepartmentOptions,
  referenceOptions,
  handleUpdate,
}) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fa-Persian", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      calendar: "islamic-umalqura",
    });
  };

  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm({
    defaultValues: {
      docId: data.docId,
      docNumber: englishToPersianDigits(data.docNumber),
      docNumber2: data.docNumber2
        ? englishToPersianDigits(data.docNumber2)
        : null,
      subject: englishToPersianDigits(data.subject),
      description: data.description,
      creationDate: formatDate(data.creationDate),
      initialDate: formatDate(data.initialDate),
      receivedDate: formatDate(data.receivedDate),
      deadline: data.deadline ? formatDate(data.deadline) : null,
      secondDate: data.secondDate ? formatDate(data.secondDate) : null,
      executionType: data.executionType,
      docType: data.docType,
      referenceType: data.referenceType,
      mainDocument: data.mainDocument,
      department: data.department?.depId,
      reference: data.reference?.id,
    },
    mode: "onBlur",
  });

  const convertToGregorian = (date) => {
    return new DateObject(date)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");
  };

  // Update Document
  const onSubmit = async (data) => {
    const formData = new FormData();
    const sanitizedDescription = DOMPurify.sanitize(data.description);
    formData.append("docNumber", persianToEnglishDigits(data.docNumber));
    formData.append("subject", persianToEnglishDigits(data.subject));
    formData.append("description", sanitizedDescription);
    if (data.executionType === "RESULT_BASE") {
      formData.append("deadline", convertToGregorian(data.deadline));
    }
    formData.append("updateDate", convertToGregorian(data.updateDate));
    formData.append("receivedDate", convertToGregorian(data.receivedDate));
    formData.append("initialDate", convertToGregorian(data.initialDate));
    formData.append("creationDate", convertToGregorian(data.creationDate));
    formData.append("executionType", data.executionType);
    formData.append("docType", data.docType);
    if (
      data.docType === "HUKAM" ||
      data.docType === "HIDAYAT" ||
      data.docType === "MUSAWWIBA"
    ) {
      formData.append("referenceType", data.referenceType);
    }
    if (data.referenceType === "AMIR") {
      formData.append("docNumber2", persianToEnglishDigits(data.docNumber2));
    }
    if (data.referenceType === "AMIR") {
      formData.append("secondDate", convertToGregorian(data.secondDate));
    }
    if (data.reference) {
      formData.append("reference", data.reference);
    }
    if (data.mainDocument && data.mainDocument.length > 0) {
      formData.append("mainDocument", data.mainDocument[0]);
    }

    try {
      await httpInterceptedService.put(
        `/document/updateDocument/${data.docId}`,
        formData
      );
      handleUpdate();
      toast.success(t("toast.updateDocSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.updateDocFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  return (
    <form key={1} onSubmit={handleSubmit(onSubmit)} style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="row mb-3">
        <label htmlFor="docNumber" className="col-md-4 col-lg-3 col-form-label">
          {t("shared.docNum")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            type="text"
            id="docNumber"
            {...register("docNumber", {
              required: t("document.validation.docNumberRequired"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.docNumber
                ? "is-invalid"
                : touchedFields.docNumber
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors.docNumber && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.docNumber?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.docType")}
        </label>
        <div className="col-md-8 col-lg-9">
          <select
            {...register("docType", {
              required: t("register.validation.docTypeRequired"),
            })}
            className={`form-select form-select-lg ${
              errors.docType
                ? "is-invalid"
                : touchedFields.docType
                ? "is-valid"
                : ""
            }`}
          >
            <option value="FARMAN">{t("filter.farman")}</option>
            <option value="MUSAWWIBA">{t("filter.musawiba")}</option>
            <option value="HIDAYAT">{t("filter.hidayat")}</option>
            <option value="HUKAM">{t("filter.hukam")}</option>
          </select>
          {errors.docType && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.docType?.message}
            </p>
          )}
        </div>
      </div>
      {watch("docType") === "HUKAM" || watch("docType") === "HIDAYAT" ? (
        <div className="row mb-3">
          <label className="col-md-4 col-lg-3 col-form-label">
            {t("shared.reference")}
          </label>
          <div className="col-md-8 col-lg-9">
            <select
              {...register("referenceType", {
                required: t("document.validation.requiredField"),
              })}
              className={`form-select form-select-lg ${
                errors.referenceType
                  ? "is-invalid"
                  : touchedFields.referenceType
                  ? "is-valid"
                  : ""
              }`}
            >
              <option value={""}>ا{t("shared.select")}</option>
              <option value="AMIR">{t("filter.leader")}</option>
              <option value="RAYESULWOZARA">{t("filter.rayesulwozara")}</option>
            </select>
            {errors.referenceType && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.referenceType?.message}
              </p>
            )}
          </div>
        </div>
      ) : watch("docType") === "MUSAWWIBA" ? (
        <div className="row mb-3">
          <label className="col-md-4 col-lg-3 col-form-label">
            {t("shared.reference")}
          </label>
          <div className="col-md-8 col-lg-9">
            <select
              {...register("referenceType", {
                required: t("document.validation.requiredField"),
              })}
              className={`form-select form-select-lg ${
                errors.referenceType
                  ? "is-invalid"
                  : touchedFields.referenceType
                  ? "is-valid"
                  : ""
              }`}
            >
              <option value={""}>ا{t("shared.select")}</option>
              <option value="KABINA">{t("filter.kabina")}</option>
              <option value="FINANCE_KABINA">
                {t("filter.economicKabina")}
              </option>
            </select>
            {errors.referenceType && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.referenceType?.message}
              </p>
            )}
          </div>
        </div>
      ) : null}
      {watch("referenceType") === "AMIR" && (
        <div className="row mb-3">
          <label
            htmlFor="docNumber2"
            className="col-md-4 col-lg-3 col-form-label"
          >
            {t("shared.docNumLeader")}
          </label>
          <div className="col-md-8 col-lg-9">
            <input
              id="docNumber2"
              {...register("docNumber2", {
                required: t("document.validation.docNumber2Required"),
              })}
              className={`form-control form-control-lg ${
                errors.docNumber2
                  ? "is-invalid"
                  : touchedFields.docNumber2
                  ? "is-valid"
                  : ""
              }`}
              autoComplete="off"
            />
            {errors.docNumber2 && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.docNumber2?.message}
              </p>
            )}
          </div>
        </div>
      )}
      {watch("referenceType") === "AMIR" && (
        <div className="row mb-3">
          <label className="col-md-4 col-lg-3 col-form-label">
            {t("shared.leaderDate")}
          </label>
          <div className="col-md-8 col-lg-9">
            <Controller
              control={control}
              name="secondDate"
              rules={{ required: true }}
              render={({
                field: { onChange, name, value },
                formState: { errors },
              }) => (
                <>
                  <DatePicker
                    value={value || ""}
                    onChange={(secondDate) => {
                      onChange(secondDate ? secondDate : "");
                    }}
                    calendar={arabic}
                    locale={arabic_fa}
                    format="YYYY/MM/DD"
                    containerClassName="custom-container"
                    inputClass={`form-control form-control-lg ${
                      errors.secondDate
                        ? "is-invalid"
                        : touchedFields.secondDate
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  {errors &&
                    errors[name] &&
                    errors[name].type === "required" && (
                      <p className="text-danger small fw-bolder mt-1">
                        {t("document.validation.docSecondDateRequired")}
                      </p>
                    )}
                </>
              )}
            />
          </div>
        </div>
      )}
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.subject")}
        </label>
        <div className="col-md-8 col-lg-9">
          <textarea
            {...register("subject", {
              required: t("document.validation.docSubjectRequired"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.subject
                ? "is-invalid"
                : touchedFields.subject
                ? "is-valid"
                : ""
            }`}
          />
          {errors.subject && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.subject?.message}
            </p>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.creationDate")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            control={control}
            name="creationDate"
            rules={{ required: true }}
            render={({
              field: { onChange, name, value },
              formState: { errors },
            }) => (
              <>
                <DatePicker
                  value={value || ""}
                  onChange={(creationDate) => {
                    onChange(creationDate ? creationDate : "");
                  }}
                  calendar={arabic}
                  locale={arabic_fa}
                  format="YYYY/MM/DD"
                  containerClassName="custom-container"
                  inputClass={`form-control form-control-lg ${
                    errors.creationDate
                      ? "is-invalid"
                      : touchedFields.creationDate
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors && errors[name] && errors[name].type === "required" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t("document.validation.docDeadLineRequired")}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.executionType")}
        </label>
        <div className="col-md-8 col-lg-9">
          <select
            {...register("executionType", {
              required: t("register.validation.executionTypeRequired"),
            })}
            className={`form-select form-select-lg ${
              errors.executionType
                ? "is-invalid"
                : touchedFields.executionType
                ? "is-valid"
                : ""
            }`}
          >
            <option value="RESULT_BASE">{t("shared.resultBased")}</option>
            <option value="CONTINUOUS">{t("shared.continuous")}</option>
            <option value="INFORMATIVE">{t("shared.informative")}</option>
          </select>
          {errors.executionType && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.executionType?.message}
            </p>
          )}
        </div>
      </div>
      {watch("executionType") === "RESULT_BASE" && (
        <div className="row mb-3">
          <label className="col-md-4 col-lg-3 col-form-label">
            {t("shared.deadline")}
          </label>
          <div className="col-md-8 col-lg-9">
            <Controller
              control={control}
              name="deadline"
              rules={{ required: true }}
              render={({
                field: { onChange, name, value },
                formState: { errors },
              }) => (
                <>
                  <DatePicker
                    value={value || ""}
                    onChange={(deadline) => {
                      onChange(deadline ? deadline : "");
                    }}
                    calendar={arabic}
                    locale={arabic_fa}
                    format="YYYY/MM/DD"
                    containerClassName="custom-container"
                    inputClass={`form-control form-control-lg ${
                      errors.deadline
                        ? "is-invalid"
                        : touchedFields.deadline
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  {errors &&
                    errors[name] &&
                    errors[name].type === "required" && (
                      <p className="text-danger small fw-bolder mt-1">
                        {t("document.validation.docDeadLineRequired")}
                      </p>
                    )}
                </>
              )}
            />
          </div>
        </div>
      )}

      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.receivedDate")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            control={control}
            name="receivedDate"
            rules={{ required: true }}
            render={({
              field: { onChange, name, value },
              formState: { errors },
            }) => (
              <>
                <DatePicker
                  value={value || ""}
                  onChange={(receivedDate) => {
                    onChange(receivedDate ? receivedDate : "");
                  }}
                  calendar={arabic}
                  locale={arabic_fa}
                  format="YYYY/MM/DD"
                  containerClassName="custom-container"
                  inputClass={`form-control form-control-lg ${
                    errors.receivedDate
                      ? "is-invalid"
                      : touchedFields.receivedDate
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors && errors[name] && errors[name].type === "required" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t("document.validation.docDeadLineRequired")}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.initialDate")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            control={control}
            name="initialDate"
            rules={{ required: true }}
            render={({
              field: { onChange, name, value },
              formState: { errors },
            }) => (
              <>
                <DatePicker
                  value={value || ""}
                  onChange={(initialDate) => {
                    onChange(initialDate ? initialDate : "");
                  }}
                  calendar={arabic}
                  locale={arabic_fa}
                  format="YYYY/MM/DD"
                  containerClassName="custom-container"
                  inputClass={`form-control form-control-lg ${
                    errors.initialDate
                      ? "is-invalid"
                      : touchedFields.initialDate
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors && errors[name] && errors[name].type === "required" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t("document.validation.docDeadLineRequired")}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("logs.department")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            name="department"
            control={control}
            rules={{
              required: t("register.validation.departmentRequired"),
            }}
            render={({ field }) => (
              <Dropdown
                optionLabel="label"
                optionValue="value"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                filter
                options={userDepartmentOptions}
                placeholder={t("shared.select")}
                style={{ width: "100%" }}
                className={`w-full md:w-14rem" ${
                  errors.department ? "p-invalid" : ""
                }`}
              />
            )}
          />
          {errors.department && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.department?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.referenceImpl")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            name="reference"
            control={control}
            render={({ field }) => (
              <Dropdown
                optionLabel="label"
                optionValue="value"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                filter
                options={referenceOptions}
                placeholder={t("shared.select")}
                style={{ width: "100%" }}
                className={"w-full md:w-14rem"}
              />
            )}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.description")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            name="description"
            control={control}
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
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("shared.chooseFile")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            type="file"
            {...register("mainDocument")}
            className="form-control form-control-lg"
          />
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
          {t("register.update")}
        </button>
      </div>
    </form>
  );
};

export default UpdateDocument;
