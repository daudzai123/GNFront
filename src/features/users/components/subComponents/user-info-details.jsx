import { useTranslation } from "react-i18next";

const UserInfoDetails = ({ data }) => {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="mb-3">{t("users.profileDetails")}</h3>
      <div className="row">
        <div className="col-lg-3 col-md-4 label ">
          {t("register.firstname")}
        </div>
        <div className="col-lg-9 col-md-8">
          <strong>{data.firstName}</strong>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 label ">{t("register.lastname")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>{data.lastName}</strong>
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
        <div className="col-lg-3 col-md-4 label">{t("register.userType")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>
            {data.userType === "ADMIN"
              ? t("register.admin")
              : data.userType === "MEMBER_OF_COMMITTEE"
              ? t("register.committeeMember")
              : t("register.normalUser")}
          </strong>
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
          <strong>{data.phoneNo ? data.phoneNo : "-"}</strong>
        </div>
      </div>
      {data.userType !== "ADMIN" && (
        <div className="row">
          <div className="col-lg-3 col-md-4 label">{t("logs.department")}</div>
          <div className="col-lg-9 col-md-8">
            <strong>
              {data.departments &&
                data?.departments?.map((department) => (
                  <div key={department.depId}>{department.depName}</div>
                ))}
            </strong>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-3 col-md-4 label">{t("register.role")}</div>
        <div className="col-lg-9 col-md-8">
          <strong>
            {data?.roleName?.map((role, index) => (
              <div key={index}>{role}</div>
            ))}
          </strong>
        </div>
      </div>
    </>
  );
};
export default UserInfoDetails;
