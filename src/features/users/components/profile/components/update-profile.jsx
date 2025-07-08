import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHttpInterceptedService from "../../../../hooks/use-httpInterceptedService";
import useAuth from "../../../../hooks/use-auth";
import useLogout from "../../../../hooks/use-logout";

const UpdateProfile = ({ data, setData, setImagePreview }) => {
  const { t } = useTranslation();
  const { auth, setAuth } = useAuth();
  const logout = useLogout();
  const httpInterceptedService = useHttpInterceptedService();
  const navigate = useNavigate();
  const {
    register,
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

  // update
  const onSubmit = async (data) => {
    const formData = new FormData();
    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      email: data.email,
      phoneNo: data.phoneNo,
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
      await httpInterceptedService.put(`/user/update/${auth.id}`, formData);
      if (auth?.email !== data.email) {
        logout();
        toast.success(t("toast.emailChangedSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      } else {
        const currentUser = await httpInterceptedService.get(
          "/user/getCurrentUser"
        );
        setData(currentUser.data);
        setAuth((prevAuth) => ({
          ...prevAuth,
          firstName: data.firstName,
          lastName: data.lastName,
          profilePath: currentUser.data?.downloadURL,
        }));

        toast.success(t("toast.userUpdateSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        reset({ file: "" });
      }
    } catch (error) {
      toast.error(t("toast.userUpdateFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      const url = new URL(window.location.href);
      navigate(url.pathname + url.search);
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-lg btn-outline-dark ms-2"
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

export default UpdateProfile;
