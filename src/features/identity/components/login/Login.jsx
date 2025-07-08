import logo from "@assets/images/logo.png";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { httpService } from "@core/http-service";
import useAuth from "../../../hooks/use-auth";
import { useEffect, useState } from "react";
import useAuthToken from "../../../hooks/use-authToken";

const Login = () => {
  const { t } = useTranslation();
  const { setAuth } = useAuth();
  const { setAuthToken, persist, setPersist } = useAuthToken();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    const { ...loginData } = data;
    try {
      const response = await httpService.post("/auth/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        const accessToken = response?.data?.access_token;
        const roles = response?.data?.roles;
        const firstName = response?.data?.firstName;
        const lastName = response?.data?.lastName;
        const userType = response?.data?.userTypes;
        const departments = response?.data?.departments;
        const profilePath = response?.data?.downloadURL;
        const id = response?.data?.id;
        const email = data.email;
        setAuth({
          id,
          firstName,
          lastName,
          userType,
          departments,
          profilePath,
          email,
        });
        setAuthToken({ accessToken, roles });
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        setErrorMessage(t("login.error.serverError"));
      } else if (err.response?.status === 401) {
        setErrorMessage(t("login.error.badCredential"));
      } else if (err.response?.status === 406) {
        setErrorMessage(t("login.error.fullAuthenticationRequired"));
      } else {
        setErrorMessage(t("login.error.loginFailure"));
      }
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
    <div  style={{ display: 'flex', width: '80%',width: '80%', marginTop: '50px', marginRight:'30px',
    justifyContent: 'center', 
    alignItems: 'center', 
     textAlign: 'center',
    }}>
   
     
      <div 
  className="card shadow-lg rounded" 
  style={{ 
    flex: 1, 
      width: '100px', 
       textAlign: 'center',
    flexShrink: 0, 
    backgroundColor: '#ffffff', 
    border: '1px solid #e0e0e0', 
    borderRadius: '15px', 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' ,
    opacity: 0.8

  }}
>
<div>
 <div style={{textAlign:"center"}}>
 <img src={logo} style={{ height: "100px" , opacity: 0.8}} />
 <h3 style={{ justifyContent: 'center',  textAlign: 'center'}}>  {t("login.introMessage")}</h3>

  </div > 
  
  </div>
  <div className="card-body">
    <div className="m-sm-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <label className="form-label fw-semibold" style={{ color: '#555' }}>
            {t("login.email")}
          </label>
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
                : touchedFields.email && watch("email")
                ? "is-valid"
                : ""
            }`}
            autoComplete="off"
            style={{ border: '1px solid #ced4da', borderRadius: '8px' }}
          />
          {errors.email && (
            <p className="text-danger small fw-bolder mt-1">
              {errors.email?.message}
            </p>
          )}
        </div>
        <div className="mb-1">
          <label className="form-label fw-semibold" style={{ color: '#555' }}>
            {t("login.password")}
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            className={`form-control form-control-lg ${
              errors.password
                ? "is-invalid"
                : touchedFields.password && watch("password")
                ? "is-valid"
                : ""
            }`}
            style={{ border: '1px solid #ced4da', borderRadius: '8px' }}
          />
          {errors.password && (
            <p className="text-danger small fw-bolder mt-1">
              {t("login.validation.passwordRequired")}
            </p>
          )}
          <div className="mt-3 d-flex align-items-center">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
              className="form-check-input me-2"
            />
            <label htmlFor="persist" style={{ color: '#666' ,padding:'2px'}}>
              {t("login.rememberMe")}
            </label>
          </div>
          <div className="mt-3">
            <Link to="/forgot-password" className="text-decoration-none text-primary">
              {t("forgotPassword.forgotYourPassword")}
            </Link>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-lg btn-primary"
            style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}
          >
            {isSubmitting ? t("login.signingin") : t("login.signin")}
          </button>
        </div>
        {errorMessage && (
          <div className="alert alert-danger text-danger p-2 mt-3">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  </div>
</div>

      </div>     
    </>
  );
};

export default Login;
