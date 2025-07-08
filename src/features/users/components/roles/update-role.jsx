import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRoleContext } from "./role-context";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const UpdateRole = ({ showUpdateRole, setShowUpdateRole }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const httpInterceptedService = useHttpInterceptedService();
  const { role, setRole } = useRoleContext();

  const {
    control,
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, touchedFields },
  } = useForm({
    defaultValues: {
      id: role.id,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (role) {
      setValue("roleName", role.roleName);
      const permissions = role.permissions.map(
        (permission) => permission.permissionName
      );
      setValue("permissions", permissions);
      setValue("description", role.description);
    }
  }, [role]);

  const onSubmit = async (data) => {
    try {
      await httpInterceptedService.post("/role/assign-permissions", data);
      reset();
      setRole(null);
      toast.success(t("toast.roleUpdateSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.roleUpdateFailure"), {
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
  }, []);

  const onClose = () => {
    setShowUpdateRole(false);
    setRole(null);
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Dialog
            header={
              <h3 className="text-muted text-center">{t("shared.edit")}</h3>
            }
            visible={showUpdateRole}
            onHide={onClose}
            footer={null}
            style={{ width: "50vw" }}
            dismissableMask
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-3">
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
                    {errors.roleName.message}
                  </p>
                )}
              </div>
              <div className="my-3">
                <label className="form-label">{t("shared.permissions")}</label>
                <Controller
                  name="permissions"
                  control={control}
                  rules={{
                    required: t("roles.validation.permissionRequired"),
                  }}
                  render={({ field }) => (
                    <MultiSelect
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={permissionOptions}
                      placeholder={t("shared.select")}
                      className={`w-full md:w-20rem ${
                        errors.permissions ? "p-invalid" : ""
                      }`}
                      display="chip"
                      filter
                      style={{ width: "100%" }}
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
              <div className="my-3">
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
              <div className="row">
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-lg btn-outline-dark ms-2"
                    onClick={onClose}
                  >
                    {t("filter.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary"
                    disabled={isSubmitting || !isDirty}
                  >
                    {isSubmitting
                      ? t("reference.submitting")
                      : t("shared.editSubmit")}
                  </button>
                </div>
              </div>
            </form>
          </Dialog>
        </div>
      </div>
    </>
  );
};
export default UpdateRole;
