import userPhoto from "@assets/images/user.jpeg";
import { Link } from "react-router-dom";
import { LiaUserEditSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";

const Card = ({
  id,
  firstName,
  lastName,
  email,
  activate,
  userType,
  position,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="card text-center border-0 shadow-lg" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="card-body">
          <img
            className="d-inline-block rounded-circle mb-3"
            src={userPhoto}
            width="90"
          />
          <h6>
            {firstName} {lastName}
          </h6>
          <p className="fs-sm text-muted">{position}</p>
          <p className="fs-sm text-muted">
            {userType === "ADMIN"
              ? t("register.admin")
              : userType === "MEMBER_OF_COMMITTEE"
              ? t("register.committeeMember")
              : t("register.normalUser")}
          </p>

          <p className={activate ? "badge bg-success" : "badge bg-danger"}>
            {activate ? t("register.active") : t("register.inactive")}
          </p>
          <p className="fs-sm fw-bold">{email}</p>

          <Link to={`/users/${id}`} className="ms-3">
            <LiaUserEditSolid fontSize={30} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Card;
