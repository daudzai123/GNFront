import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrimeReactBreadCrumb from "../../../components/BreadCrumb";
import UserInfo from "./subComponents/user-info";
import UserInfoDetails from "./subComponents/user-info-details";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";
import Loading from "../../../components/loading";
import UserUpdate from "./subComponents/user-update";

const UserDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [toogleState, setToogleState] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const httpInterceptedService = useHttpInterceptedService();
  const toogleTab = (index) => {
    setToogleState(index);
  };
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await httpInterceptedService.get(`/user/get/${id}`);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

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

  return (
    <>
      {loading ? (
        <Loading theme="primary" />
      ) : (
        <div className="row">
          <div className="mb-2">
            <PrimeReactBreadCrumb
              first={t("mainLayout.sidebar.home")}
              firstUrl={"/"}
              second={t("users.userList")}
              secondUrl={"/users"}
              last={t("users.userDetails")}
            />
          </div>
          <div className="col-xl-4">
            <UserInfo data={data} imagePreview={imagePreview} />
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
                    <UserInfoDetails data={data} />
                  </div>
                  <div
                    className={
                      toogleState === 2
                        ? "content-tab active-content-tab"
                        : "content-tab"
                    }
                    id="profile-edit"
                  >
                    <UserUpdate
                      data={data}
                      roleOptions={roleOptions}
                      setImagePreview={setImagePreview}
                      departmentOptions={departmentOptions}
                    />
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

export default UserDetails;
