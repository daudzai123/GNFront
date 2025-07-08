import userPhoto from "@assets/images/user.jpeg";
import { useTranslation } from "react-i18next";

const UserInfo = ({ data, imagePreview }) => {
  const { t } = useTranslation();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="card">
      <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile"
            className="rounded-circle mb-2"
            width={200}
            height={200}
          />
        ) : data.downloadURL !== null ? (
          <img
            src={`${BASE_URL}${data.downloadURL}`}
            alt="Profile"
            className="rounded-circle mb-2"
            width={200}
            height={200}
          />
        ) : (
          <img src={userPhoto} alt="Profile" className="rounded-circle mb-2" />
        )}

        <h2>
          {data.firstName} {data.lastName}
        </h2>
        <h3>{data.position}</h3>
        <span className="badge bg-info">
          {data.userType === "ADMIN"
            ? t("register.admin")
            : data.userType === "MEMBER_OF_COMMITTEE"
            ? t("register.committeeMember")
            : t("register.normalUser")}
        </span>
      </div>
    </div>
  );
};

export default UserInfo;
