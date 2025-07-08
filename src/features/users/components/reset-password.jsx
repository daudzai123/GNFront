import logo from "@assets/images/logo.png";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Link,
  useActionData,
  useLocation,
  useNavigate,
  useNavigation,
  useRouteError,
  useSubmit,
} from "react-router-dom";
import { httpService } from "@core/http-service";
import { useEffect, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const ResetPassword = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const routeErrors = useRouteError();
  const isSuccessOperation = useActionData();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!userId) {
      return navigate("/login");
    }
  }, []);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({ mode: "onBlur" });
  const submitForm = useSubmit();

  const onSubmit = (data) => {
    data.Id = userId;
    const { ...userNewPassword } = data;
    submitForm(userNewPassword, { method: "post" });
    reset();
  };

  useEffect(() => {
    if (isSuccessOperation) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [isSuccessOperation]);

  return (
    <>
      <div className="text-center" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <img src={logo} style={{ height: "80px" }} />
        <h1 className="h2">{t("forgotPassword.forgotPassword")}</h1>
        <p className="lead">{t("forgotPassword.resetPassTitle")}</p>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="m-sm-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  {t("password.newPassword")}
                </label>
                <div className="input-group">
                  <input
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    {...register("newPassword", {
                      required: t("login.validation.passwordRequired"),
                      pattern: {
                        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
                        message: t("register.validation.passwordPattern"),
                      },
                    })}
                    className={`form-control form-control-lg rounded-end rounded-0 ${
                      errors.newPassword
                        ? "is-invalid"
                        : touchedFields.newPassword
                        ? "is-valid"
                        : ""
                    }`}
                  />
                  <span
                    className="input-group-text rounded-start rounded-0"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.newPassword && (
                  <p className="text-danger small fw-bolder mt-1">
                    {errors.newPassword?.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="confirmNewPassword" className="form-label">
                  {t("register.repeatPassword")}
                </label>

                <input
                  {...register("confirmNewPassword", {
                    required: t("register.validation.repeatPasswordRequired"),
                    validate: (value) => {
                      if (watch("newPassword") !== value) {
                        return t("register.validation.notMatching");
                      }
                    },
                  })}
                  className={`form-control form-control-lg ${
                    errors.confirmNewPassword
                      ? "is-invalid"
                      : touchedFields.confirmNewPassword
                      ? "is-valid"
                      : ""
                  }`}
                  type="password"
                />
                {errors.confirmNewPassword &&
                  errors.confirmNewPassword.type === "required" && (
                    <p className="text-danger small fw-bolder mt-1">
                      {errors.confirmNewPassword?.message}
                    </p>
                  )}
                {errors.confirmNewPassword &&
                  errors.confirmNewPassword.type === "validate" && (
                    <p className="text-danger small fw-bolder mt-1">
                      {errors.confirmNewPassword?.message}
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
                    : t("password.resetPassword")}
                </button>
                <Link to={"/login"} className="mt-3">
                  {t("shared.backLoginPage")}
                </Link>
              </div>

              {routeErrors && (
                <div className="alert alert-danger text-danger p-2 mt-3">
                  <p className="mb-0">
                    {t("forgotPassword.message.resetPasswordFailure")}
                  </p>
                </div>
              )}
              {isSuccessOperation && (
                <div className="alert alert-success text-success p-2 mt-3">
                  {t("forgotPassword.resetPasswordSuccess")}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export async function resetPasswordAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const response = await httpService.post("/user/reset-password", data);
  return response.status === 200;
}
export default ResetPassword;
