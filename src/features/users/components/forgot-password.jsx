import logo from "@assets/images/logo.png";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { httpService } from "@core/http-service";
import { useEffect, useState } from "react";
import { useEmailContext } from "../../../contexts/email/email-context";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { setEmail } = useEmailContext();
  const [isSuccessOperation, setIsSuccessOperation] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const response = await httpService.post("/user/otp", data);
      if (response.status === 200) {
        setErrorMessage(null);
        setIsSuccessOperation(true);
        const enteredEmail = data.email;
        setEmail(enteredEmail);
      }
    } catch (error) {
      reset();
      if (!error?.response) {
        setErrorMessage(t("login.error.serverError"));
      } else if (error.response?.status === 404) {
        setErrorMessage(t("forgotPassword.message.emailNotFound"));
      } else {
        setErrorMessage(t("forgotPassword.message.emailServerError"));
      }
    }
  };

  useEffect(() => {
    if (isSuccessOperation) {
      setTimeout(() => {
        navigate("/check-otp");
      }, 3000);
    }
  }, [isSuccessOperation]);

  return (
    <>
      <div className="text-center" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <img src={logo} style={{ height: "80px" }} />
        <h1 className="h2">{t("forgotPassword.forgotPassword")}</h1>
        <p className="lead">{t("forgotPassword.forgotPassTitle")}</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="m-sm-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">{t("login.email")}</label>
                <input
                  type="email"
                  className={`form-control form-control-lg ${
                    errors.email
                      ? "is-invalid"
                      : touchedFields.email
                      ? "is-valid"
                      : ""
                  }`}
                  {...register("email", {
                    required: true,
                    pattern: /\S+@\S+\.\S+/,
                  })}
                  autoComplete="off"
                />
                {errors.email && errors.email.type === "required" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t("login.validation.emailRequired")}
                  </p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t("register.validation.validEmailRequired")}
                  </p>
                )}
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-lg btn-primary"
                >
                  {isSubmitting
                    ? t("forgotPassword.checkingEmail")
                    : t("forgotPassword.sendCode")}
                </button>
                <Link to={"/login"} className="mt-3">
                  {t("shared.backLoginPage")}
                </Link>
              </div>
              {errorMessage && (
                <div className="alert alert-danger text-danger p-2 mt-3">
                  {errorMessage}
                </div>
              )}
              {isSuccessOperation && (
                <div className="alert alert-success text-success p-2 mt-3">
                  {t("forgotPassword.successOperation")}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export async function forgotPasswordAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const response = await httpService.post("/user/otp", data);
  return response.status === 200;
}

export default ForgotPassword;
