import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { toast } from "react-toastify";
import PrimeReactBreadCrumb from "../../../components/BreadCrumb";
import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import useAuth from "../../hooks/use-auth";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";
import { Editor } from "primereact/editor";
import DOMPurify from "dompurify";
import { persianToEnglishDigits } from "../../../components/convert-digits";

const CreateDocument = () => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [linkedDocuments, setLinkedDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [referenceOptions, setReferenceOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({
    defaultValues: { linkingDocs: null },
    mode: "onBlur",
  });

  useEffect(() => {
    if (auth && auth.departments) {
      const mappedDepartments = auth.departments.map((dep) => ({
        label: dep.depName,
        value: dep.depId,
      }));
      setDepartmentOptions(mappedDepartments);
      if (auth.departments?.length === 1) {
        setValue("department", auth.departments[0].depId);
      }
    }
  }, [auth, setValue]);

  useEffect(() => {
    const getReferences = async () => {
      try {
        const response = await httpInterceptedService.get(
          "/reference/allwithoutpage"
        );

        if (response.data) {
          const options = response.data.map((reference) => ({
            value: reference.id,
            label: reference.refName,
          }));
          setReferenceOptions(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    getReferences();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    const sanitizedDescription = DOMPurify.sanitize(data.description);
    formData.append("docNumber", persianToEnglishDigits(data.docNumber));
    if (data.docNumber2) {
      formData.append("docNumber2", persianToEnglishDigits(data.docNumber2));
    }
    formData.append("subject", persianToEnglishDigits(data.subject));
    formData.append("description", sanitizedDescription);
    formData.append("department", data.department);
    if (data.executionType === "RESULT_BASE") {
      const deadlineDate = new DateObject(data.deadline)
        .convert(gregorian, gregorian_en)
        .format("YYYY-MM-DD");
      formData.append("deadline", deadlineDate);
    }
    if (data.secondDate) {
      const secondDate = new DateObject(data.secondDate)
        .convert(gregorian, gregorian_en)
        .format("YYYY-MM-DD");
      formData.append("secondDate", secondDate);
    }

    const updatedDate = new DateObject(data.updateDate)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");
    formData.append("updateDate", updatedDate);

    const convertedReceivedDate = new DateObject(data.receivedDate)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");
    formData.append("receivedDate", convertedReceivedDate);

    const convertedInitialDate = new DateObject(data.initialDate)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");
    formData.append("initialDate", convertedInitialDate);
    formData.append("executionType", data.executionType);
    formData.append("docType", data.docType);
    if (data.reference) {
      formData.append("reference", data.reference);
    }
    if (data.docType === "HUKAM" || data.docType === "HIDAYAT") {
      formData.append("referenceType", data.referenceType);
    }
    formData.append("mainDocument", data.mainDocument[0]);
    for (const file of data.appendantDocuments) {
      formData.append("appendantDocuments", file);
    }
    if (selectedDocuments) {
      selectedDocuments.forEach((doc, index) => {
        formData.append(`linkingDocs[${index}]`, doc.docId);
      });
    }

    try {
      await httpInterceptedService.post("/document/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reset();
      navigate("/documents");
      toast.success(t("toast.createDocSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.createDocFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  // Search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const pattern = /^[a-zA-Z0-9\u0600-\u06FF\s]+$/;
    if (searchTerm && pattern.test(searchTerm)) {
      setLoading(true);
      try {
        const response = await httpInterceptedService.get(
          `/document/forlinking?searchterm=${searchTerm}`
        );

        setLinkedDocuments(response.data);
      } catch (error) {
        console.error("Error fetching linked documents:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert(t("register.validation.invalidInput"));
      setLinkedDocuments([]);
    }
  };

  const handleReset = () => {
    reset();
    setSearchTerm("");
    setLinkedDocuments([]);
  };

  const docTypeBodyTemplate = (rowData) => {
    switch (rowData.docType) {
      case "FARMAN":
        return t("filter.farman");
   
      default:
        return rowData.docType;
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="mb-2">
            <PrimeReactBreadCrumb
              first={t("mainLayout.sidebar.home")}
              firstUrl={"/"}
              second={t("shared.documentList")}
              secondUrl={"/documents"}
              last={t("document.createDoc")}
            />
          </div>
          <div className="card">
            <div className="card-header">
              <h2>{t("document.createNewDoc")}</h2>
            </div>
            <div className="card-body">
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0 mx-auto">
                    <label className="form-label">{t("shared.docType")}</label>
                    <select
                      {...register("docType", {
                        required: t("document.validation.requiredField"),
                      })}
                      className={`form-select form-select-lg ${
                        errors.docType
                          ? "is-invalid"
                          : touchedFields.docType
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <option value={""}>{t("filter.chooseDocType")}</option>
                      <option value="FARMAN">{t("filter.farman")}</option>
                 
                    </select>
                    {errors.docType && (
                      <p className="text-danger small fw-bolder mt-1">
                        {errors.docType?.message}
                      </p>
                    )}
                  </div>
                  {watch("docType") === "HUKAM" ||
                  watch("docType") === "HIDAYAT" ? (
                    <div className="col-sm-10 col-md-6 col-lg-6 mx-auto">
                      <label className="form-label">
                        {t("shared.reference")}
                      </label>
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
                        <option value={""}>
                          {t("filter.chooseReference")}
                        </option>
                        <option value="AMIR">{t("filter.leader")}</option>
                        <option value="RAYESULWOZARA">
                          {t("filter.rayesulwozara")}
                        </option>
                      </select>
                      {errors.referenceType && (
                        <p className="text-danger small fw-bolder mt-1">
                          {errors.referenceType?.message}
                        </p>
                      )}
                    </div>
                  ) : watch("docType") === "MUSAWWIBA" ? (
                    <div className="col-sm-10 col-md-6 col-lg-6 mx-auto">
                      <label className="form-label">
                        {t("shared.reference")}
                      </label>
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
                        <option value={""}>
                          {t("filter.chooseReference")}
                        </option>
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
                  ) : (
                    <div className="col"></div>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mx-auto">
                    <label className="form-label">{t("shared.docNum")}</label>
                    <input
                      type="text"
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
                  {watch("referenceType") === "AMIR" ? (
                    <>
                      <div className="col-sm-10 col-md-3 col-lg-3 mb-3 mb-md-0 mx-auto">
                        <label className="form-label">
                          {t("shared.docNumLeader")}
                        </label>
                        <input
                          {...register("docNumber2", {
                            required: t("document.validation.requiredField"),
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
                      <div className="col-sm-10 col-md-3 col-lg-3 mx-auto">
                        <label className="form-label">
                          {t("shared.leaderDate")}
                        </label>
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
                                placeholder={t("shared.datePlaceholder")}
                                containerClassName="custom-container"
                                inputClass={`form-control form-control-lg ${
                                  errors.secondDate
                                    ? "is-invalid"
                                    : watch("secondDate")
                                    ? "is-valid"
                                    : ""
                                }`}
                              />
                              {errors &&
                                errors[name] &&
                                errors[name].type === "required" && (
                                  <p className="text-danger small fw-bolder mt-1">
                                    {t("document.validation.requiredField")}
                                  </p>
                                )}
                            </>
                          )}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col"></div>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-12 col-lg-12 mx-auto">
                    <label className="form-label">
                      {t("shared.description")}
                    </label>
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
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0 mx-auto">
                    <label className="form-label">
                      {t("shared.initialDate")}
                    </label>
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
                            placeholder={t("shared.datePlaceholder")}
                            containerClassName="custom-container"
                            inputClass={`form-control form-control-lg ${
                              errors.initialDate
                                ? "is-invalid"
                                : watch("initialDate")
                                ? "is-valid"
                                : ""
                            }`}
                          />
                          {errors &&
                            errors[name] &&
                            errors[name].type === "required" && (
                              <p className="text-danger small fw-bolder mt-1">
                                {t("document.validation.requiredField")}
                              </p>
                            )}
                        </>
                      )}
                    />
                  </div>
                  <div className="col-sm-10 col-md-6 col-lg-6 mx-auto">
                    <label className="form-label">
                      {t("shared.receivedDate")}
                    </label>
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
                            placeholder={t("shared.datePlaceholder")}
                            containerClassName="custom-container"
                            inputClass={`form-control form-control-lg ${
                              errors.receivedDate
                                ? "is-invalid"
                                : watch("receivedDate")
                                ? "is-valid"
                                : ""
                            }`}
                          />
                          {errors &&
                            errors[name] &&
                            errors[name].type === "required" && (
                              <p className="text-danger small fw-bolder mt-1">
                                {t("document.validation.requiredField")}
                              </p>
                            )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">{t("shared.subject")}</label>
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
                  <div className="col-sm-10 col-md-3 col-lg-3 mb-3 mb-lg-0">
                    <label className="form-label">{t("logs.department")}</label>
                    <Controller
                      name="department"
                      control={control}
                      rules={
                        departmentOptions.length > 1
                          ? { required: t("document.validation.requiredField") }
                          : {}
                      }
                      render={({ field }) => (
                        <Dropdown
                          optionLabel="label"
                          optionValue="value"
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          filter
                          options={departmentOptions}
                          placeholder={t("shared.select")}
                          style={{ width: "100%" }}
                          className={`w-full md:w-14rem" ${
                            errors.department ? "p-invalid" : ""
                          }`}
                          {...field}
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
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0 mx-auto">
                    <label className="form-label">
                      {t("shared.timeBasedDocType")}
                    </label>
                    <select
                      {...register("executionType", {
                        required: t("document.validation.requiredField"),
                      })}
                      className={`form-select form-select-lg ${
                        errors.executionType
                          ? "is-invalid"
                          : touchedFields.executionType
                          ? "is-valid"
                          : ""
                      }`}
                    >
                      <option value={""}>{t("shared.select")}</option>
                      <option value="RESULT_BASE">
                        {t("shared.resultBased")}
                      </option>
                      <option value="CONTINUOUS">
                        {t("shared.continuous")}
                      </option>
                      <option value="INFORMATIVE">
                        {t("shared.informative")}
                      </option>
                    </select>
                    {errors.executionType && (
                      <p className="text-danger small fw-bolder mt-1">
                        {errors.executionType?.message}
                      </p>
                    )}
                  </div>
                  {watch("executionType") === "RESULT_BASE" ? (
                    <div className="col-sm-10 col-md-6 col-lg-6 mx-auto">
                      <label className="form-label">
                        {t("shared.deadline")}
                      </label>
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
                              placeholder={t("shared.datePlaceholder")}
                              containerClassName="custom-container"
                              inputClass={`form-control form-control-lg ${
                                errors.deadline
                                  ? "is-invalid"
                                  : watch("deadline")
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
                  ) : (
                    <div className="col"></div>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0 mx-auto">
                    <label className="form-label mx-3">
                      {t("shared.chooseFile")}
                    </label>
                    <input
                      type="file"
                      {...register("mainDocument", {
                        required: t("document.validation.requiredField"),
                      })}
                      className={`form-control form-control-lg ${
                        errors.mainDocument
                          ? "is-invalid"
                          : touchedFields.mainDocument
                          ? "is-valid"
                          : ""
                      }`}
                    />
                    {errors.mainDocument && (
                      <p className="text-danger small fw-bolder mt-1">
                        {errors.mainDocument?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-sm-10 col-md-6 col-lg-6 mx-auto">
                    <label className="form-label mx-3">
                      {t("shared.appendants")}
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      multiple
                      {...register("appendantDocuments")}
                    />
                  </div>
                </div>
          
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-lg btn-outline-dark mx-2"
                    onClick={handleReset}
                  >
                    {t("shared.clear")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("register.saving")
                      : t("document.submitDoc")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default CreateDocument;
