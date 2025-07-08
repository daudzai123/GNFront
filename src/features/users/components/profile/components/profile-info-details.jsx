import { useTranslation } from "react-i18next";
import useAuth from "../../../../hooks/use-auth";

const ProfileInfoDetails = ({ data }) => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const isAdmin = auth?.userType === "ADMIN";
  return (
    <>
      <h3 className="mb-3">{t("users.profileDetails")}</h3>
      <div className="row">
        <div className="col-lg-3 col-md-4 label ">
          {t("department.nameLastname")}
        </div>
        <div className="col-lg-9 col-md-8">
          <strong>
            {data.firstName} {data.lastName}
          </strong>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 label">{t("register.position")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>{data.position}</strong>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 label">
          {t("register.userStatus")}
        </div>
        <div className="col-lg-9 col-md-8">
          <span
            className={data.activate ? "badge bg-success" : "badge bg-danger"}
          >
            {data.activate ? t("register.active") : t("register.inactive")}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 label">{t("register.email")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>{data.email}</strong>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 label">{t("register.mobile")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>{data.phoneNo}</strong>
        </div>
      </div>
      {!isAdmin && (
        <div className="row">
          <div className="col-lg-3 col-md-4 label">{t("logs.department")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.departments?.map((dep, depId) => (
                <div key={depId}>{dep.depName}</div>
              ))}
            </strong>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-3 col-md-4 label">{t("register.userType")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>
            {data.userType === "ADMIN"
              ? t("register.admin")
              : data.userType === "MEMBER_OF_COMMITTEE"
              ? t("register.committeeMember")
              : data.userType === "MEMBER_OF_DEPARTMENT"
              ? t("register.normalUser")
              : data.userType}
          </strong>
        </div>
      </div>
    </>
  );
};

export default ProfileInfoDetails;
