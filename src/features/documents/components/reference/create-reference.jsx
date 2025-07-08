import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const CreateReference = ({ setShowAddReference }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const httpInterceptedService = useHttpInterceptedService();

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    const { ...referenceData } = data;
    try {
      await httpInterceptedService.post("/reference/add", referenceData);
      reset();
      setShowAddReference(false);
      toast.success(t("toast.referenceAddSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.referenceAddFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      const url = new URL(window.location.href);
      navigate(url.pathname + url.search);
    }
  };

  const onClose = () => {
    setShowAddReference(false);
  };

  return (
    <>
      <div className="row mb-5" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-3">{t("reference.createReference")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
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
                        {errors.refName?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">{t("shared.details")}</label>
                    <textarea
                      {...register("description", {
                        required: t("reference.validation.description"),
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
                </div>
                <div className="row">
                  <div className="col d-flex align-items-end justify-content-end">
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        className="btn btn-lg btn-outline-dark mx-2"
                        onClick={onClose}
                      >
                        {t("shared.close")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? t("reference.submitting")
                          : t("reference.submitReference")}
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
export default CreateReference;
