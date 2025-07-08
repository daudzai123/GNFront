import { Tooltip } from "primereact/tooltip";
import { Link, useNavigation, useSearchParams } from "react-router-dom";
import Pagination from "../../../../components/pagination";
import Spinner from "../../../../components/spinner";
import { CiEdit } from "react-icons/ci";
import SearchBar from "../../../../components/searchBar";
import { useEffect, useState } from "react";
import { LuUserPlus } from "react-icons/lu";
import { FaUsersViewfinder } from "react-icons/fa6";
import notfound from "@assets/images/notfound.jpeg";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ToggleButton } from "primereact/togglebutton";
import { toast } from "react-toastify";
import { FaUserCheck } from "react-icons/fa";
import { FaUserSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import Loading from "../../../../components/loading";
import useAuthToken from "../../../hooks/use-authToken";
import useAuth from "../../../hooks/use-auth";

const UserList = () => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const { auth } = useAuth();
  const httpInterceptedService = useHttpInterceptedService();
  const [searchParams, setSearchParams] = useSearchParams();
  const [usersData, setUsersData] = useState([]);
  const [searchResultFound, setSearchResultsFound] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userCounts, setUserCounts] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigation = useNavigation();

  // Get users
  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/user/all";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getUsers = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setUsersData(response.data?.content);
      setUserCounts(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [searchParams]);

  // Confirm Change user activate
  const acceptConfirmation = async (userId, activate) => {
    try {
      if (activate) {
        const response = await httpInterceptedService.put(
          `/user/disableuser/${userId}`
        );
        if (response.data === "User Disabled Successfully") {
          toast.success(t("toast.disableAccountSuccess"), {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        } else {
          toast.error(t("toast.disableAccountFailure"), {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      } else {
        const response = await httpInterceptedService.put(
          `/user/enableuser/${userId}`
        );
        if (response.data === "User Enabled Successfully") {
          toast.success(t("toast.enableAccountSuccess"), {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        } else {
          toast.error(t("toast.enableAccountFailure"), {
            position: toast.POSITION.BOTTOM_LEFT,
          });
        }
      }
      setUsersData((prevUsersData) => {
        const updatedUsersData = prevUsersData.map((user) =>
          user.id === userId ? { ...user, activate: !activate } : user
        );
        return updatedUsersData;
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setConfirmationVisible(false);
    }
  };

  const rejectConfirmation = () => {
    setConfirmationVisible(false);
  };

  const confirmActivate = (event, userId, activate) => {
    event.preventDefault();
    setSelectedUserId(userId);
    setConfirmationVisible(true);
    setChecked(activate);
  };

  // Search Users
  const searchUsers = async (term) => {
    setSearchLoading(true);
    try {
      const response = await httpInterceptedService.get(
        `/user/search${term ? "?searchItem=" + term : ""}`
      );
      if (response && response.data.length > 0) {
        setUsersData(response.data);
        setSearchResultsFound(true);
      } else {
        setUsersData([]);
        setSearchResultsFound(false);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchUsers = () => {
    getUsers();
    setSearchResultsFound(true);
    setSearchLoading(true);
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <div className="card" >
              <div className="card-header " style={{background:'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)'}}>
                <h3 className="text-light border-bottom border-secondary pb-2">
                  {t("users.userList")}
                </h3>
                <div className="row mt-3">
                  <div className="col-md-6 col-sm-10 mb-3 mb-md-0">
                    <SearchBar searchItems={searchUsers} />
                  </div>
                  <div className="col-md-6 col-sm-10 d-flex justify-content-md-end">
                    <div>
                      {authToken?.roles.includes("user_creation") && (
                        <Link
                          to={"/users/register-user"}
                          className="btn btn-lg btn-primary ms-2"
                        >
                          <LuUserPlus size={17} className="ms-1" />
                          {t("breadcrumb.newUser")}
                        </Link>
                      )}
                      <button
                        className="btn btn-lg btn-info"
                        onClick={fetchUsers}
                      >
                        <FaUsersViewfinder size={17} className="ms-1" />
                        {t("users.allUsers")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {navigation.state !== "idle" && <Spinner />}
              <ConfirmDialog
                visible={confirmationVisible}
                onHide={() => setConfirmationVisible(false)}
                message={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="pi pi-info-circle"
                      style={{ marginLeft: "8px", fontSize: "1.5em" }}
                    ></i>
                    {t("users.confirmChangeUserStatus")}
                  </div>
                }
                header={t("shared.changeStatusConfirmation")}
                position="top"
                style={{ width: "30vw" }}
                breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
                acceptClassName="p-button-danger"
                acceptLabel={t("document.documentGrid.yes")}
                rejectLabel={t("document.documentGrid.no")}
                accept={() => acceptConfirmation(selectedUserId, checked)}
                reject={rejectConfirmation}
              />
              <div className="card-body" style={{ overflowX: "auto",padding:0,margin:0 }}>
                <table className="table table-striped">
                  <thead className="font-weight-bold  text-white bg-primary">
                    <tr>
                      <th>{t("register.firstname")}</th>
                      <th>{t("register.lastname")}</th>
                      <th>{t("register.position")}</th>
                      <th>{t("register.email")}</th>
                      <th>{t("register.mobile")}</th>
                      <th>{t("register.userType")}</th>
                      {authToken?.roles.includes("change_user_status") && (
                        <th>{t("register.userStatus")}</th>
                      )}
                      <th>{t("shared.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchLoading ? (
                      <tr>
                        <td colSpan="8">
                          <Spinner />
                        </td>
                      </tr>
                    ) : !searchResultFound ? (
                      <tr >
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          <div className="empty-result">
                            <img src={notfound} alt="Not Found" width={100} />
                            <p className="alert-warning text-center mt-3">
                              {t("shared.notFound")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      usersData.map((user) => {
                        return (
                          <tr key={user.id} style={{background: 'linear-gradient(-225deg, #E3FDF5 -70%, #FFE6FA 180%)'}}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.position}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNo}</td>
                            <td>
                              {user.userType === "ADMIN"
                                ? t("register.admin")
                                : user.userType === "MEMBER_OF_COMMITTEE"
                                ? t("register.committeeMember")
                                : t("register.normalUser")}
                            </td>
                            {authToken?.roles.includes(
                              "change_user_status"
                            ) && (
                              <td>
                                <ToggleButton
                                  onLabel={t("register.active")}
                                  offLabel={t("register.inactive")}
                                  onIcon={<FaUserCheck />}
                                  offIcon={<FaUserSlash />}
                                  checked={user.activate}
                                  onClick={(e) =>
                                    confirmActivate(e, user.id, user.activate)
                                  }
                                  className="w-9rem gap-2"
                                  disabled={auth?.email === user.email}
                                />
                              </td>
                            )}
                            <td className="table-action">
                              <Tooltip
                                target=".custom-edit-icon"
                                content={t("users.editUser")}
                                position="top"
                              />
                              {authToken?.roles.includes("user_edit") && (
                                <Link to={`/users/${user.id}`} className="ms-3">
                                  <CiEdit
                                    size={30}
                                    className="custom-edit-icon"
                                  />
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {searchResultFound && (
                <div className="card-footer">
                  <Pagination totalRecords={userCounts.totalElements} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserList;
