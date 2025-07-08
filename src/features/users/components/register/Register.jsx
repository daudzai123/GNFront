import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import PrimeReactBreadCrumb from "../../../../components/BreadCrumb";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Register = () => {
  const { t } = useTranslation();
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const httpInterceptedService = useHttpInterceptedService();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({
    defaultValues: {},
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    if (!Array.isArray(data.departmentIds)) {
      data.departmentIds = [data.departmentIds];
    }
    const formData = new FormData();
    const user1 = {
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
      "user1",
      new Blob([JSON.stringify(user1)], {
        type: "application/json",
      })
    );
    formData.append("file", data.file[0]);

    try {
      await httpInterceptedService.post("/user/add", formData);
      reset();
      setImagePreview(null);
      toast.success(t("toast.registerUserSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      if (
        error.response?.data?.Email === "Email already exsit in the database!"
      ) {
        toast.error(t("register.validation.duplicateEmail"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } else {
        toast.error(t("toast.registerUserFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await httpInterceptedService.get("/department/all");

        if (response.data) {
          const options = response.data.content.map((department) => ({
            value: department.depId,
            label: department.depName,
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await httpInterceptedService.get("/role/all");

        if (response.data) {
          const options = response.data.content.map((role) => ({
            value: role.roleName,
            label: role.roleName,
          }));
          setRoleOptions(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleReset = () => {
    reset();
    setImagePreview(null);
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="mb-2">
            <PrimeReactBreadCrumb
              first={t("shared.main")}
              firstUrl={"/"}
              second={t("mainLayout.sidebar.users")}
              secondUrl={"/users"}
              last={t("breadcrumb.newUser")}
            />
          </div>
          <div className="card">
            <div className="card-header">
              <h1 className="h2">{t("register.registerNewUser")}</h1>
              <p className="lead">{t("register.introMessage")}</p>
            </div>
            <div className="card-body">
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">
                      {t("register.firstname")}
                    </label>
                    <input
                      type="text"
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
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">
                      {t("register.lastname")}
                    </label>
                    <input
                      type="text"
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
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">
                      {t("register.position")}
                    </label>
                    <input
                      type="text"
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
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">{t("register.role")}</label>
                    <Controller
                      name="roleName"
                      control={control}
                      style={{padding:"0px",margin:"0px"}}
                      rules={{
                        required: t("register.validation.userRoleRequired"),
                      }}
                      render={({ field }) => (
                        <MultiSelect
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          filter
                         
                          options={roleOptions}
                          placeholder={t("register.selectRole")}
                          display="chip"
                          style={{ width: "100%"}}
                          className={`w-full md:w-20rem ${
                            errors.roleName ? "p-invalid" : ""
                          }`}
                          {...field}
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
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">
                      {t("register.userType")}
                    </label>
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
                      <option value={""}>{t("register.selectUserType")}</option>
                      <option value="ADMIN">{t("register.admin")}</option>
                   
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
                  {watch("userType") === "MEMBER_OF_COMMITTEE" ? (
                    <div className="col-sm-10 col-md-6 col-lg-6">
                      <label className="form-label">
                        {t("logs.department")}
                      </label>
                      <Controller
                        name="departmentIds"
                        control={control}
                        rules={{
                          required: t("register.validation.userDepRequired"),
                        }}
                        render={({ field }) => (
                          <MultiSelect
                            value={field.value}
                            options={departmentOptions}
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            filter
                            placeholder={t("register.selectDepartment")}
                            display="chip"
                            style={{
                              width: "100%",
                            }}
                            className={`w-full md:w-20rem ${
                              errors.departmentIds ? "p-invalid" : ""
                            }`}
                            {...field}
                          />
                        )}
                      />
                      {errors.departmentIds && (
                        <p className="text-danger small fw-bolder mt-1">
                          {errors.departmentIds?.message}
                        </p>
                      )}
                    </div>
                  ) : watch("userType") === "MEMBER_OF_DEPARTMENT" ? (
                    <div className="col-sm-10 col-md-6 col-lg-6">
                      <label className="form-label">
                        {t("logs.department")}
                      </label>
                      <Controller
                        name="departmentIds"
                        control={control}
                        rules={{
                          required: t("register.validation.userDepRequired"),
                        }}
                        render={({ field }) => (
                          <Dropdown
                            optionLabel="label"
                            optionValue="value"
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            filter
                            options={departmentOptions}
                            placeholder={t("register.selectDepartment")}
                            style={{ width: "100%" }}
                            className={`w-full md:w-14rem ${
                              errors.departmentIds ? "p-invalid" : ""
                            }`}
                            {...field}
                          />
                        )}
                      />
                      {errors.departmentIds && (
                        <p className="text-danger small fw-bolder mt-1">
                          {errors.departmentIds?.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="col"></div>
                  )}
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">{t("register.email")}</label>
                    <input
                      type="email"
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
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">
                      {t("register.userStatus")}
                    </label>
                    <div>
                      <input
                        type="checkbox"
                        id="activate"
                        name="activate"
                        className="form-check-input ms-2"
                        defaultChecked
                        {...register("activate")}
                      />
                      <label className="form-check-label" htmlFor="activate">
                        {t("register.active")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">{t("register.mobile")}</label>
                    <input
                      type="number"
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
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">
                      {t("register.profilePic")}
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      {...register("file")}
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Picture"
                          width={200}
                          height={200}
                          className="rounded-circle"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-sm-10 col-md-6 col-lg-6 mb-3 mb-md-0">
                    <label className="form-label">
                      {t("register.password")}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: t("register.validation.passwordRequired"),
                          pattern: {
                            value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
                            message: t("register.validation.passwordPattern"),
                          },
                        })}
                        className={`form-control form-control-lg rounded-end rounded-0 ${
                          errors.password
                            ? "is-invalid"
                            : touchedFields.password
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
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <label className="form-label">
                      {t("register.repeatPassword")}
                    </label>
                    <input
                      {...register("confirmPassword", {
                        required: t(
                          "register.validation.repeatPasswordRequired"
                        ),
                        validate: (value) =>
                          watch("password") === value ||
                          t("register.validation.notMatching"),
                      })}
                      className={`form-control form-control-lg ${
                        errors.confirmPassword
                          ? "is-invalid"
                          : touchedFields.confirmPassword
                          ? "is-valid"
                          : ""
                      }`}
                      type="password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-danger small fw-bolder mt-1">
                        {errors.confirmPassword?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-lg btn-outline-dark mx-2"
                    onClick={handleReset}
                  >
                    {t("register.resetForm")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-lg btn-primary"
                  >
                    {isSubmitting
                      ? t("register.saving")
                      : t("register.register")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
