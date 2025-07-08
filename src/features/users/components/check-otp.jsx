import { useEffect, useState } from "react";
import logo from "@assets/images/logo.png";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { httpService } from "../../../core/http-service";
import { useEmailContext } from "../../../contexts/email/email-context";

const CheckOtp = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { email } = useEmailContext();
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (!email) {
      return navigate("/login");
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await httpService.post("/user/checkOtp", data);
      if (response.status === 200) {
        navigate("/reset-password", { state: { userId: response.data } });
      }
    } catch (err) {
      if (!err?.response) {
        setErrorMessage(t("login.error.serverError"));
      } else if (
        err.response?.status === 400 &&
        err.response?.data === "Invalid OTP Code"
      ) {
        setErrorMessage(t("forgotPassword.message.invalidOtp"));
      } else if (
        err.response?.status === 400 &&
        err.response?.data === "OTP code expired"
      ) {
        setResendEnabled(true);
        setErrorMessage(t("forgotPassword.message.expiredOtp"));
      } else {
        setErrorMessage(t("forgotPassword.message.checkOtpFailure"));
      }
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      const response = await httpService.post("/user/otp", { email: email });
      if (response.status === 200) {
        setErrorMessage(null);
        setSuccessMessage(t("forgotPassword.message.sendOtpSuccess"));
        reset();
        setResendEnabled(false);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      if (!error?.response) {
        setErrorMessage(t("login.error.serverError"));
      } else {
        setErrorMessage(t("forgotPassword.message.sendOtpFailure"));
      }
    }
  };

  return (
    <>
      <div className="text-center" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <img src={logo} style={{ height: "80px" }} />
        <h1 className="h2">{t("forgotPassword.forgotPassword")}</h1>
        <p className="lead">{t("forgotPassword.otpTitle")}</p>
      </div>

      <div className="card" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="card-body">
          <div className="m-sm-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">
                  {t("forgotPassword.otpCode")}
                </label>
                <input
                  type="number"
                  {...register("otp", {
                    required: true,
                    minLength: 6,
                    maxLength: 6,
                  })}
                  className={`form-control form-control-lg ${
                    errors.otp
                      ? "is-invalid"
                      : touchedFields.otp
                      ? "is-valid"
                      : ""
                  }`}
                />
                {errors.otp && errors.otp.type === "required" && (
                  <p className="text-danger small fw-bolder mt-1">
                    {t("forgotPassword.validation.otpRequired")}
                  </p>
                )}
                {errors.otp &&
                  (errors.otp.type === "minLength" ||
                    errors.otp.type === "maxLength") && (
                    <p className="text-danger small fw-bolder mt-1">
                      {t("forgotPassword.validation.sixDigit")}
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
                    ? t("login.signingin")
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
              {successMessage && (
                <div className="alert alert-success text-success p-2 mt-3">
                  {successMessage}
                </div>
              )}

              {resendEnabled && (
                <div className="d-flex flex-row mt-3">
                  <p>{t("forgotPassword.otpExpired")}</p>
                  <Link className="mx-2" onClick={handleResend}>
                    {t("forgotPassword.resendOtp")}
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default CheckOtp;
