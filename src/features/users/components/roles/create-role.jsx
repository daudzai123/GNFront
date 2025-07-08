import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const CreateRole = ({ setShowAddRole }) => {
  const { t, i18n } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();
  const navigate = useNavigate();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    const { ...roleData } = data;
    try {
      await httpInterceptedService.post("/role/add", roleData);
      reset();
      setShowAddRole(false);
      toast.success(t("toast.addRoleSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.addRoleFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      const url = new URL(window.location.href);
      navigate(url.pathname + url.search);
    }
  };

  const [permissionOptions, setPermissionOptions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await httpInterceptedService.get("/per/all");

        if (response.data) {
          const options = response.data.map((permission) => ({
            value: permission.permissionName,
            label:
              i18n.language === "pa"
                ? permission.psName
                : i18n.language === "fa"
                ? permission.drName
                : permission.permissionName,
          }));
          setPermissionOptions(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [i18n.language]);

  const onClose = () => {
    setShowAddRole(false);
  };

  return (
    <>
      <div className="row mb-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>{t("shared.addRole")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">{t("register.role")}</label>
                    <input
                      type="text"
                      {...register("roleName", {
                        required: t("roles.validation.roleNameRequired"),
                        pattern: {
                          value: /^[a-zA-Z0-9\u0600-\u06FF\s_-]+$/,
                          message: t("register.validation.inputPattern"),
                        },
                      })}
                      className={`form-control form-control-lg ${
                        errors.roleName
                          ? "is-invalid"
                          : touchedFields.roleName
                          ? "is-valid"
                          : ""
                      }`}
                      autoComplete="off"
                    />
                    {errors.roleName && (
                      <p className="text-danger small fw-bolder mt-1">
                        {errors.roleName?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">
                      {t("shared.permissions")}
                    </label>
                    <Controller
                      name="permissions"
                      control={control}
                      rules={{
                        required: t("roles.validation.permissionRequired"),
                      }}
                      render={({ field }) => (
                        <MultiSelect
                          optionLabel="label"
                          optionValue="value"
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          options={permissionOptions}
                          placeholder={t("shared.select")}
                          style={{ width: "100%" }}
                          className={`w-full md:w-20rem ${
                            errors.permissions ? "p-invalid" : ""
                          }`}
                          display="chip"
                          filter
                          {...field}
                        />
                      )}
                    />
                    {errors.permissions && (
                      <p className="text-danger small fw-bolder mt-1">
                        {errors.permissions?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">{t("shared.details")}</label>
                    <textarea
                      {...register("description", {
                        required: t("roles.validation.descriptionRequired"),
                        pattern: {
                          value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
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
                        {errors.description?.message}
                      </p>
                    )}
                  </div>
                  <div className="col d-flex align-items-end justify-content-end">
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn-danger btn btn-lg btn-outline-dark ms-2"
                        onClick={onClose}
                        style={{ paddingInline: "24px", color: "white", }}
                      >
                        {t("shared.close")}
                      </button>

   
         
        
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary"
                        disabled={isSubmitting}
                        style={{ paddingInline: "24px", color: "white", }}
                      >
                        {isSubmitting
                          ? t("reference.submitting")
                          : t("shared.save")}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateRole;
