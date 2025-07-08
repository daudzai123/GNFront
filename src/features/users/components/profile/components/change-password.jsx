import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../../hooks/use-httpInterceptedService";
import useAuth from "../../../../hooks/use-auth";
import useLogout from "../../../../hooks/use-logout";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

const ChangePassword = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const logout = useLogout();
  const httpInterceptedService = useHttpInterceptedService();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register: register2,
    watch: watch2,
    reset: reset2,
    handleSubmit: handleSubmit2,
    formState: {
      isSubmitting: isSubmitting2,
      errors: errors2,
      touchedFields: touchedFields2,
    },
  } = useForm({
    defaultValues: {
      id: auth.id,
    },
    mode: "onBlur",
  });

  // change password
  const onSubmitChangePassword = async (data) => {
    const { confirmPassword, ...passwordData } = data;
    try {
      await httpInterceptedService.post("/user/change-password", passwordData);
      reset2({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success(t("toast.passwordChangeSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });

      logout();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        toast.error(
          errorData === "Old Password is incorrect!"
            ? t("toast.invalidCurrentPassword")
            : errorData.newPassword === "size must be between 6 and 20"
            ? t("toast.passwordLength")
            : t("toast.passwordChangeFailure"),
          {
            position: toast.POSITION.BOTTOM_LEFT,
          }
        );
      } else {
        toast.error(t("toast.passwordChangeFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    }
  };

  const handleCancel = () => {
    reset2({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <form onSubmit={handleSubmit2(onSubmitChangePassword)}>
      <div className="row mb-3">
        <label
          htmlFor="oldPassword"
          className="col-md-4 col-lg-3 col-form-label"
        >
          {t("password.currentPassword")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="oldPassword"
            type="password"
            id="oldPassword"
            {...register2("oldPassword", {
              required: t("password.validation.currentPasswordRequired"),
            })}
            className={`form-control form-control-lg ${
              errors2.oldPassword
                ? "is-invalid"
                : touchedFields2.oldPassword
                ? "is-valid"
                : ""
            }`}
          />
          {errors2.oldPassword && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.oldPassword?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label
          htmlFor="newPassword"
          className="col-md-4 col-lg-3 col-form-label"
        >
          {t("password.newPassword")}
        </label>
        <div className="col-md-8 col-lg-9">
          <div className="input-group">
            <input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              id="newPassword"
              {...register2("newPassword", {
                required: t("password.validation.newPasswordRequired"),
                pattern: {
                  value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
                  message: t("register.validation.passwordPattern"),
                },
              })}
              className={`form-control form-control-lg rounded-end rounded-0 ${
                errors2.newPassword
                  ? "is-invalid"
                  : touchedFields2.newPassword
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
          {errors2.newPassword && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.newPassword?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label
          htmlFor="confirmPassword"
          className="col-md-4 col-lg-3 col-form-label"
        >
          {t("register.repeatPassword")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            {...register2("confirmPassword", {
              required: t("password.validation.confirmPasswordRequired"),
              validate: (value) => {
                if (watch2("newPassword") !== value) {
                  return t("password.validation.notMatchPassword");
                }
              },
            })}
            className={`form-control form-control-lg ${
              errors2.confirmPassword
                ? "is-invalid"
                : touchedFields2.confirmPassword
                ? "is-valid"
                : ""
            }`}
          />
          {errors2.confirmPassword && (
            <p className="text-danger small fw-bolder mt-1">
              {errors2.confirmPassword?.message}
            </p>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-lg btn-outline-dark ms-2"
          onClick={handleCancel}
        >
          {t("shared.clear")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting2}
          className="btn btn-lg btn-primary"
        >
          {isSubmitting2 ? t("register.saving") : t("password.resetPassword")}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
