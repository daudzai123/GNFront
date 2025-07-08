import { useNavigation, useParams } from "react-router-dom";
import Spinner from "../../../components/spinner";
import useAxios from "@core/useAxios";
import BreadCrumb from "../../../components/BreadCrumb";
import userPhoto from "@assets/images/user.jpeg";
import useAuth from "../../hooks/use-auth";
import { useTranslation } from "react-i18next";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import Loading from "../../../components/loading";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DepartmentMembers = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { depId } = useParams();
  const { auth } = useAuth();
  const isCommitteeMember = auth?.userType === "MEMBER_OF_COMMITTEE";
  const [departmentMembers, , loading] = useAxios({
    url: `/user/getAllUserSOfSingleDepartment/${depId}`,
  });

  return (
    <>
      {loading ? (
        <Loading theme="primary" />
      ) : (
        <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
          {isCommitteeMember && (
            <BreadCrumb
              first={t("shared.main")}
              firstUrl={"/"}
              second={t("mainLayout.sidebar.myDepartments")}
              secondUrl={"/committee-departments"}
              last={t("department.depMembers")}
            />
          )}
          <div className="col-12 mt-2">
            <div className="card">
              <div className="card-header bg-dark">
                <h3 className="text-light">{t("department.depMemberList")}</h3>
              </div>
              {navigation.state !== "idle" && <Spinner />}
              <div className="card-body" style={{ overflowX: "auto" }}>
                <table className="table table-striped">
                  <thead className="font-weight-bold">
                    <tr>
                      <th>{t("department.nameLastname")}</th>
                      <th>{t("register.position")}</th>
                      <th>{t("register.email")}</th>
                      <th>{t("register.userType")}</th>
                      <th>{t("register.userStatus")}</th>
                      <th>{t("register.role")}</th>
                      <th>{t("register.profilePic")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentMembers.length ? (
                      departmentMembers.map((user) => {
                        return (
                          <tr key={user.id}>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.position}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.userType === "ADMIN"
                                ? t("register.admin")
                                : user.userType === "MEMBER_OF_COMMITTEE"
                                ? t("register.committeeMember")
                                : t("register.normalUser")}
                            </td>
                            <td>
                              <span
                                className={
                                  user.activate
                                    ? "badge bg-success"
                                    : "badge bg-danger"
                                }
                              >
                                {user.activate
                                  ? t("register.active")
                                  : t("register.inactive")}
                              </span>
                            </td>
                            <td>{user.roleName[0]}</td>
                            <td>
                              {user.profilePath !== null ? (
                                <img
                                  src={`${BASE_URL}${user.downloadURL}`}
                                  alt="Profile"
                                  className="rounded-circle mb-2"
                                  width={50}
                                  height={50}
                                />
                              ) : (
                                <img
                                  src={userPhoto}
                                  alt="Profile"
                                  className="rounded-circle mb-2"
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          <div className="empty-result">
                            <img
                              src={emptyFolder}
                              alt="Not Found"
                              width={100}
                            />
                            <p className="alert-warning text-center">
                              {t("shared.notFound")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentMembers;
