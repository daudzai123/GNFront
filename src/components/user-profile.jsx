import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../features/hooks/use-auth";
import { AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import userPhoto from "@assets/images/user.jpeg";
import { useTranslation } from "react-i18next";
import useLogout from "../features/hooks/use-logout";

const UserProfile = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const checkIfclickOutside = (e) => {
      if (show && ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", checkIfclickOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfclickOutside);
    };
  }, [show]);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dropdown ms-2">
      <a
        className="nav-flag dropdown-toggle"
        onClick={() => setShow(true)}
        style={{ textDecoration: "none" }}
      >
        <div className="d-flex align-items-center">
          {auth?.profilePath !== null ? (
            <img
              src={`${BASE_URL}${auth?.profilePath}`}
              alt="Profile"
              className="mx-2"
            />
          ) : (
            <img src={userPhoto} alt="Profile" className="mx-2" />
          )}

          <span style={{ fontSize: "15px" }}>
            {auth?.firstName + " " + auth?.lastName}
          </span>
        </div>
      </a>
      <div
        ref={ref}
        className={`dropdown-menu dropdown-menu-end ${
          show ? "show" : undefined
        }`}
      >
        <Link
          to={`/users-profile/${auth.id}`}
          className="dropdown-item fw-bolder d-flex align-items-center gap-2"
          style={{
            textAlign: "right",
          }}
          onClick={() => setShow(false)}
        >
          <CgProfile />
          <span className="align-middle">{t("shared.userProfile")}</span>
        </Link>
        <Link
          className="dropdown-item fw-bolder d-flex align-items-center gap-2"
          style={{
            textAlign: "right",
          }}
          onClick={signOut}
        >
          <AiOutlineLogout />
          <span className="align-middle">{t("shared.logout")}</span>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
