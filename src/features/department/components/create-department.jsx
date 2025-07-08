import { Controller, useForm } from "react-hook-form";
import logo from "@assets/images/logo.png"; 
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import { Dropdown } from "primereact/dropdown";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";

const CreateDepartment = ({ setShowAddDepartment }) => {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const httpInterceptedService = useHttpInterceptedService();
  const navigate = useNavigate();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, touchedFields },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    const { ...departmentData } = data;
    try {
      await httpInterceptedService.post("/department/add", departmentData);
      reset();
      setShowAddDepartment(false);
      toast.success(t("toast.createDepSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } catch (error) {
      toast.error(t("toast.createDepFailed"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    } finally {
      const url = new URL(window.location.href);
      navigate(url.pathname + url.search);
    }
  };

  const [departmentOptions, setDepartmentOptions] = useState([]);

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

  const onClose = () => {
    setShowAddDepartment(false);
  };

  return (
    <>

      <div className="card-header " style={{background:'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)'}}>
              <h3>{t("department.createDepartment")}</h3>
            </div>
   
          
            


            {/* devide the main conent of form and logo */}
            <div className="row mb-5" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
  {/* Form Section - Takes Half Width */}
  <div className="col-12 col-md-6">
    <div className="card-body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mb-3">
          <div className="col-sm-10 col-md-12">
            <label className="form-label">{t("department.depName")}</label>
            <input
              type="text"
              {...register("depName", {
                required: t("department.validation.depNameRequired"),
                pattern: {
                  value: /^[a-zA-Z0-9\u0600-\u06FF\s]+$/,
                  message: t("register.validation.inputPattern"),
                },
              })}
              className={`form-control form-control-lg ${
                errors.depName ? "is-invalid" : touchedFields.depName ? "is-valid" : ""
              }`}
              autoComplete="off"
            />
            {errors.depName && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.depName?.message}
              </p>
            )}
          </div>
        </div>

        {/* Dropdown Section */}
        <div className="row mb-3">
          <div className="col-sm-12">
            <label htmlFor="showDepartment" className="form-check-label me-2" style={{marginInline:"6px"}}>
              دیپارتمنت مافوق
            </label>:
            <input
              type="checkbox"
              id="showDepartment"
              className="form-check-input"
              checked={showDropdown}
              onChange={() => setShowDropdown(!showDropdown)}
              style={{marginInline:"4px"}}
            />
          </div>
          {showDropdown && (
            <div className="col-sm-10 col-md-12">
              <label className="form-label">{t("department.seniorDep")}</label>
              <Controller
                name="parentDepartmentId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    filter
                    options={departmentOptions}
                    placeholder={t("shared.select")}
                    style={{ width: "100%" }}
                    className={`w-full md:w-14rem ${errors.parentDepartmentId ? "p-invalid" : ""}`}
                    {...field}
                  />
                )}
              />
              {errors.parentDepartmentId && (
                <p className="text-danger small fw-bolder mt-1">
                  {errors.parentDepartmentId?.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="row mb-3">
          <div className="col-sm-10 col-md-12">
            <label className="form-label">{t("department.details")}</label>
            <textarea
              {...register("description", {
                pattern: {
                  value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
                  message: t("register.validation.inputPattern"),
                },
              })}
              className={`form-control form-control-lg ${
                errors.description ? "is-invalid" : touchedFields.description ? "is-valid" : ""
              }`}
            />
            {errors.description && (
              <p className="text-danger small fw-bolder mt-1">
                {errors.description?.message}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="btn btn-lg btn-outline-dark mx-2  btn-danger"
            onClick={onClose}
            style={{ paddingInline: "24px", color: "white", }}
          >
            {t("shared.close")}
          </button>
          <button
            type="submit"
            className="btn btn-lg btn-primary"
            disabled={isSubmitting}
            style={{ paddingInline: "34px" }}
          >
            {isSubmitting ? t("reference.submitting") : t("shared.save")}
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* Image Section - Takes Half Width */}
  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
    <img src={logo} alt="Logo" style={{ height: "300px", maxWidth: "100%" }} />
  </div>
</div>

       
      
   
    
    </>
  );
};
export default CreateDepartment;




