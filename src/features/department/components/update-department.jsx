import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDepartmentContext } from "../department-context";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";

const UpdateDepartment = ({
  showUpdateDepartment,
  setShowUpdateDepartment,
}) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();
  const navigate = useNavigate();
  const { department, setDepartment } = useDepartmentContext();

  const {
    control,
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (department) {
      setValue("depName", department.depName);
      setValue(
        "parentDepartmentId",
        department.parent ? department.parent.depId : null
      );
      setValue("description", department.description);
      setValue("depId", department.depId);
    }
  }, [department]);

  const onSubmit = async (data) => {
    try {
      await httpInterceptedService.put(
        `/department/update/${department.depId}`,
        data
      );
      reset();
      setDepartment(null);
      toast.success(t("toast.editDepartmentSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.editDepartmentFailed"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      const url = new URL(window.location.href);
      navigate(url.pathname + url.search);
    }
  };

  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await httpInterceptedService.get("/department/all");

        if (response.data) {
          const options = response.data.content.map((department) => ({
            label: department.depName,
            value: department.depId,
          }));
          setDepartmentOptions(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const onClose = () => {
    setShowUpdateDepartment(false);
    setDepartment(null);
  };

  return (
    <div className="p-fluid" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <Dialog
        header={
          <h3 className="text-muted text-center">
            {t("department.editDepartment")}
          </h3>
        }
        visible={showUpdateDepartment}
        onHide={onClose}
        footer={
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-lg btn-outline-dark ms-2"
              type="button"
              onClick={onClose}
            >
              {t("filter.cancel")}
            </button>
            <button
              className="btn btn-lg btn-primary"
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty}
            >
              {t("shared.editSubmit")}
            </button>
          </div>
        }
        style={{ width: "50vw" }}
        dismissableMask
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-3">
            <div className="col-sm-10 col-md-10 col-lg-10 mx-auto d-table h-100">
              <label className="form-label">{t("department.depName")}</label>
              <input
                type="text"
                {...register("depName", {
                  required: t("department.validation.depNameRequired"),
                  pattern: {
                    value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                    message: t("register.validation.inputPattern"),
                  },
                })}
                className={`form-control form-control-lg ${
                  errors.depName
                    ? "is-invalid"
                    : touchedFields.depName
                    ? "is-valid"
                    : ""
                }`}
                autoComplete="off"
              />
              {errors.depName && (
                <p className="text-danger small fw-bolder mt-1">
                  {errors.depName?.message}
                </p>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-10 col-md-10 col-lg-10 mx-auto d-table h-100">
              <label className="form-label">{t("department.seniorDep")}</label>
              <Controller
                name="parentDepartmentId"
                control={control}
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
                    className="w-full md:w-14rem"
                  />
                )}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-10 col-md-10 col-lg-10 mx-auto d-table h-100">
              <label className="form-label">{t("department.details")}</label>
              <textarea
                {...register("description", {
                  pattern: {
                    value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                    message: t("register.validation.inputPattern"),
                  },
                })}
                className={`form-control form-control-lg ${
                  errors.description
                    ? "is-invalid"
                    : touchedFields.description
                    ? "is-valid"
                    : ""
                }`}
              />
              {errors.description && (
                <p className="text-danger small fw-bolder mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default UpdateDepartment;
