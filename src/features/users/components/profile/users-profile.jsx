import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import UpdateProfile from "./components/update-profile";
import ProfileInfoDetails from "./components/profile-info-details";
import ProfileInfo from "./components/profile-info";
import ChangePassword from "./components/change-password";
import Loading from "../../../../components/loading";
import useAuthToken from "../../../hooks/use-authToken";

const Profile = () => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const { id } = useParams();
  const httpInterceptedService = useHttpInterceptedService();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toogleState, setToogleState] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const toogleTab = (index) => {
    setToogleState(index);
  };

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await httpInterceptedService.get(`/user/get/${id}`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfileData();
  }, [id]);

  return (
    <>
      {loading ? (
        <Loading theme="primary" />
      ) : (
        <div className="row">
          <div className="col-xl-4">
            <ProfileInfo data={data} imagePreview={imagePreview} />
          </div>
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body pt-3">
                <div className="blac-tabs">
                  <ul className="nav nav-tabs nav-tabs-bordered">
                    <li className="nav-item">
                      <button
                        className={
                          toogleState === 1
                            ? "nav-link active-tabs"
                            : "nav-link"
                        }
                        onClick={() => toogleTab(1)}
                        data-bs-toggle="tab"
                        data-bs-target="#profile-overview"
                      >
                        {t("users.userDetails")}
                      </button>
                    </li>
                    {authToken?.roles.includes("edit_profile") && (
                      <li className="nav-item">
                        <button
                          className={
                            toogleState === 2
                              ? "nav-link active-tabs"
                              : "nav-link"
                          }
                          onClick={() => toogleTab(2)}
                          data-bs-toggle="tab"
                          data-bs-target="#profile-edit"
                        >
                          {t("users.updateProfile")}
                        </button>
                      </li>
                    )}
                    {authToken?.roles.includes("change_password") && (
                      <li className="nav-item">
                        <button
                          className={
                            toogleState === 3
                              ? "nav-link active-tabs"
                              : "nav-link"
                          }
                          onClick={() => toogleTab(3)}
                          data-bs-toggle="tab"
                          data-bs-target="#profile-change-password"
                        >
                          {t("password.resetPassword")}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="content-tabs">
                  <div
                    className={
                      toogleState === 1
                        ? "content-tab active-content-tab"
                        : "content-tab"
                    }
                    id="profile-overview"
                  >
                    <ProfileInfoDetails data={data} />
                  </div>

                  <div
                    className={
                      toogleState === 2
                        ? "content-tab active-content-tab"
                        : "content-tab"
                    }
                    id="profile-edit"
                  >
                    <UpdateProfile
                      data={data}
                      setData={setData}
                      setImagePreview={setImagePreview}
                    />
                  </div>

                  <div
                    className={
                      toogleState === 3
                        ? "content-tab active-content-tab"
                        : "content-tab"
                    }
                    id="profile-change-password"
                  >
                    <ChangePassword />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
