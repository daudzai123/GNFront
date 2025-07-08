import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useReferenceContext } from "./reference-context";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const UpdateReference = ({ showUpdateReference, setShowUpdateReference }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reference, setReference } = useReferenceContext();
  const httpInterceptedService = useHttpInterceptedService();

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, touchedFields },
  } = useForm({
    defaultValues: {
      id: reference.id,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (reference) {
      setValue("refName", reference.refName);
      setValue("description", reference.description);
    }
  }, [reference]);

  const onSubmit = async (data) => {
    try {
      await httpInterceptedService.post(
        `/reference/update/${reference.id}`,
        data
      );
      reset();
      setReference(null);
      toast.success(t("toast.referenceUpdateSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.referenceUpdateFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      const url = new URL(window.location.href);
      navigate(url.pathname + url.search);
    }
  };

  const onClose = () => {
    setShowUpdateReference(false);
    setReference(null);
  };

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          <Dialog
            header={
              <h3 className="text-muted text-center">{t("shared.edit")}</h3>
            }
            visible={showUpdateReference}
            onHide={onClose}
            footer={null}
            style={{ width: "50vw" }}
            dismissableMask
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-3">
                <label className="form-label">
                  {t("reference.referenceName")}
                </label>
                <input
                  type="text"
                  {...register("refName", {
                    required: t("reference.validation.refNameRequired"),
                    pattern: {
                      value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                      message: t("register.validation.inputPattern"),
                    },
                  })}
                  className={`form-control form-control-lg ${
                    errors.refName
                      ? "is-invalid"
                      : touchedFields.refName
                      ? "is-valid"
                      : ""
                  }`}
                  autoComplete="off"
                />
                {errors.refName && (
                  <p className="text-danger small fw-bolder mt-1">
                    {errors.refName.message}
                  </p>
                )}
              </div>

              <div className="my-3">
                <label className="form-label">{t("shared.details")}</label>
                <textarea
                  {...register("description", {
                    required: t("reference.validation.description"),
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
                      : t("register.update")}
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
export default UpdateReference;
