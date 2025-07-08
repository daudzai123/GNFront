import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/use-auth";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const UserUpdate = ({
  data,
  roleOptions,
  departmentOptions,
  setImagePreview,
}) => {
  const { t } = useTranslation();
  const { auth, setAuth } = useAuth();
  const httpInterceptedService = useHttpInterceptedService();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({
    defaultValues: {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      email: data.email,
      phoneNo: data.phoneNo,
      userType: data.userType,
      activate: data.activate,
      departmentIds: data.departments.map((department) => department.depId),
      roleName: data.roleName,
      profilePath: data.profilePath,
    },
    mode: "onBlur",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!Array.isArray(data.departmentIds)) {
      data.departmentIds = [data.departmentIds];
    }
    const formData = new FormData();
    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      activate: data.activate,
      email: data.email,
      phoneNo: data.phoneNo,
      userType: data.userType,
      password: data.password,
      departmentIds: data.departmentIds,
      roleName: data.roleName,
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(user)], {
        type: "application/json",
      })
    );

    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    try {
      await httpInterceptedService.put(`/user/update/${data.id}`, formData);

      if (auth.id === data.id) {
        try {
          const currentUser = await httpInterceptedService.get(
            "/user/getCurrentUser"
          );

          setAuth((prevAuth) => ({
            ...prevAuth,
            firstName: data.firstName,
            lastName: data.lastName,
            profilePath: currentUser.data?.downloadURL,
          }));
        } catch (error) {
          toast.error(t("toast.userUpdateFailure"), {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      }

      toast.success(t("toast.userUpdateSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      reset({
        password: "",
        confirmPassword: "",
      });
      navigate("/users");
    } catch (error) {
      toast.error(t("toast.userUpdateFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <div className="row mb-3">
        <label htmlFor="firstName" className="col-md-4 col-lg-3 col-form-label">
          {t("register.firstname")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="firstName"
            type="text"
            id="firstName"
            {...register("firstName", {
              required: t("register.validation.firstnameRequired"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.firstName
                ? "is-invalid"
                : touchedFields.firstName
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors.firstName && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.firstName?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="lastName" className="col-md-4 col-lg-3 col-form-label">
          {t("register.lastname")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="lastName"
            type="text"
            id="lastName"
            {...register("lastName", {
              required: t("register.validation.lastnameRequired"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.lastName
                ? "is-invalid"
                : touchedFields.lastName
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors.lastName && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.lastName?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="position" className="col-md-4 col-lg-3 col-form-label">
          {t("register.position")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="position"
            type="text"
            id="position"
            {...register("position", {
              required: t("register.validation.positionRequired"),
              pattern: {
                value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                message: t("register.validation.inputPattern"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.position
                ? "is-invalid"
                : touchedFields.position
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors.position && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.position?.message}
            </p>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("register.userType")}
        </label>
        <div className="col-md-8 col-lg-9">
          <select
            {...register("userType", {
              required: t("register.validation.userTypeRequired"),
            })}
            className={`form-select form-select-lg ${
              errors.userType
                ? "is-invalid"
                : touchedFields.userType
                ? "is-valid"
                : ""
            }`}
          >
            <option value="ADMIN"> {t("register.admin")}</option>
            <option value="MEMBER_OF_COMMITTEE">
              {t("register.committeeMember")}
            </option>
            <option value="MEMBER_OF_DEPARTMENT">
              {t("register.normalUser")}
            </option>
          </select>
          {errors.userType && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.userType?.message}
            </p>
          )}
        </div>
      </div>
      {watch("userType") === "MEMBER_OF_COMMITTEE" ? (
        <div className="row mb-3">
          <label
            htmlFor="departmentIds"
            className="col-md-4 col-lg-3 col-form-label"
          >
            {t("logs.department")}
          </label>
          <div className="col-md-8 col-lg-9">
            <Controller
              name="departmentIds"
              control={control}
              rules={{
                required: t("register.validation.userDepRequired"),
              }}
              render={({ field }) => (
                <MultiSelect
                  id="departmentIds"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={departmentOptions}
                  display="chip"
                  filter
                  style={{ width: "100%" }}
                />
              )}
            />
            {errors.departmentIds && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.departmentIds?.message}
              </p>
            )}
          </div>
        </div>
      ) : watch("userType") === "MEMBER_OF_DEPARTMENT" ? (
        <div className="row mb-3">
          <label
            htmlFor="departmentIds"
            className="col-md-4 col-lg-3 col-form-label"
          >
            {t("logs.department")}
          </label>
          <div className="col-md-8 col-lg-9">
            <Controller
              name="departmentIds"
              control={control}
              rules={{
                required: t("register.validation.userDepRequired"),
              }}
              render={({ field }) => (
                <Dropdown
                  id="departmentIds"
                  value={field.value[0]}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  options={departmentOptions}
                  placeholder={t("register.selectDepartment")}
                  filter
                  style={{
                    width: "100%",
                  }}
                  className={`w-full md:w-14rem" ${
                    errors.departmentIds ? "p-invalid" : ""
                  }`}
                />
              )}
            />
            {errors.departmentIds && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.departmentIds?.message}
              </p>
            )}
          </div>
        </div>
      ) : null}
      <div className="row mb-3">
        <label htmlFor="Email" className="col-md-4 col-lg-3 col-form-label">
          {t("register.email")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="email"
            type="email"
            id="Email"
            {...register("email", {
              required: t("register.validation.emailRequired"),
              pattern: {
                value: /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/,
                message: t("register.validation.validEmailRequired"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.email
                ? "is-invalid"
                : touchedFields.email
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
          />
          {errors.email && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.email?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="phoneNo" className="col-md-4 col-lg-3 col-form-label">
          {t("register.mobile")}
        </label>
        <div className="col-md-8 col-lg-9">
          <input
            name="phoneNo"
            type="number"
            id="phoneNo"
            {...register("phoneNo", {
              required: t("register.validation.mobileRequired"),
              minLength: {
                value: 10,
                message: t("register.validation.mobileLength"),
              },
              maxLength: {
                value: 10,
                message: t("register.validation.mobileLength"),
              },
            })}
            className={`form-control form-control-lg ${
              errors.phoneNo
                ? "is-invalid"
                : touchedFields.phoneNo
                ? "is-valid"
                : ""
            }`}
          />
          {errors.phoneNo && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.phoneNo?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="roleName" className="col-md-4 col-lg-3 col-form-label">
          {t("register.role")}
        </label>
        <div className="col-md-8 col-lg-9">
          <Controller
            name="roleName"
            control={control}
            rules={{
              required: t("register.validation.userRoleRequired"),
            }}
            render={({ field }) => (
              <MultiSelect
                id="roleName"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={roleOptions}
                display="chip"
                filter
                style={{ width: "100%" }}
              />
            )}
          />
          {errors.roleName && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.roleName?.message}
            </p>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="activate" className="col-md-4 col-lg-3 col-form-label">
          {t("register.userStatus")}
        </label>
        <div className="col-md-8 col-lg-9">
          <div>
            <input
              type="checkbox"
              id="activate"
              name="activate"
              className="form-check-input ms-2"
              {...register("activate")}
            />
            <label className="form-check-label" htmlFor="activate">
              {t("register.active")}
            </label>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-md-4 col-lg-3 col-form-label">
          {t("register.profilePic")}
        </label>
        <div className="col-md-8 col-lg-9">
          <div className="pt-2">
            <input
              type="file"
              {...register("file")}
              onChange={handleFileChange}
              className="form-control form-control-lg"
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="password" className="col-md-4 col-lg-3 col-form-label">
          {t("register.password")}
        </label>
        <div className="col-md-8 col-lg-9">
          <div className="input-group">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                pattern: {
                  value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
                  message: t("register.validation.passwordPattern"),
                },
              })}
              className={`form-control form-control-lg rounded-end rounded-0 ${
                errors.password
                  ? "is-invalid"
                  : touchedFields.password && watch("password")
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
          {errors.password && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.password?.message}
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
            {...register("confirmPassword", {
              validate: (value) => {
                if (watch("password") !== value) {
                  return t("password.validation.notMatchPassword");
                }
              },
            })}
            className={`form-control form-control-lg ${
              errors.confirmPassword
                ? "is-invalid"
                : touchedFields.confirmPassword && watch("confirmPassword")
                ? "is-valid"
                : ""
            }`}
          />
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.confirmPassword?.message}
              </p>
            )}
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-lg btn-outline-dark ms-3"
          onClick={handleCancel}
        >
          {t("filter.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-lg btn-primary"
        >
          {isSubmitting ? t("register.saving") : t("register.update")}
        </button>
      </div>
    </form>
  );
};

export default UserUpdate;
