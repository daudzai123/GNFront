import { Tooltip } from "primereact/tooltip";
import { Link, useNavigation, useSearchParams } from "react-router-dom";
import { useRoleContext } from "./role-context";
import { FiEdit } from "react-icons/fi";
import { lazy, useEffect, useState } from "react";
const UpdateRole = lazy(() => import("./update-role"));
import Pagination from "../../../../components/pagination";
import Spinner from "../../../../components/spinner";
import { useTranslation } from "react-i18next";
import CreateRole from "./create-role";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import Loading from "../../../../components/loading";
import { IoIosAdd } from "react-icons/io";
import useAuthToken from "../../../hooks/use-authToken";

const RoleList = () => {
  const { t, i18n } = useTranslation();
  const { authToken } = useAuthToken();
  const httpInterceptedService = useHttpInterceptedService();
  const navigation = useNavigation();
  const { role, setRole } = useRoleContext();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleCounts, setRoleCounts] = useState([]);
  const [showUpdateRole, setShowUpdateRole] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [languageType, setLanguageType] = useState(i18n.language);

  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/role/all";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getRoles = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setRoles(response.data?.content);
      setRoleCounts(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [role, showAddRole, searchParams]);

  const handleEditClick = (role) => {
    setShowUpdateRole(true);
    setRole(role);
  };

  useEffect(() => {
    const language = i18n.language;
    setLanguageType(language);
  }, [i18n.language]);

  return (
    <>
      <div className="row">
        <div className="col-12" >
          {role && showUpdateRole && (
            <UpdateRole
              setShowUpdateRole={setShowUpdateRole}
              showUpdateRole={showUpdateRole}
            />
          )}
          {showAddRole && <CreateRole setShowAddRole={setShowAddRole} />}
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <div className="card">
              {navigation.state !== "idle" && <Spinner />}
              <div className="card-header  d-flex justify-content-between" style={{background:'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)'}}>
                <h3 className="text-dark">{t("roles.rolesList")}</h3>
                {authToken?.roles.includes("role_creation") && (
                  <button
                    onClick={() => setShowAddRole(true)}
                    className="btn btn-primary fw-bolder d-flex justify-content-end"
                  >
                    <IoIosAdd size={25} />
                    {t("roles.newRole")}
                  </button>
                )}
              </div>
              <div className="card-body " style={{ overflowX: "auto",margin:0,padding:0 }}>
                <table className="table table-striped">
                  <thead className="font-weight-bold">
                    <tr className="bg-primary text-white">
                      <th>{t("shared.number")}</th>
                      <th>{t("register.role")}</th>
                      <th>{t("shared.details")}</th>
                      <th>{t("shared.permissions")}</th>
                      <th>{t("shared.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => {
                      return (
                        <tr key={role.id} style={{background: 'linear-gradient(-225deg, #E3FDF5 -70%, #FFE6FA 180%)'}}>
                          <td>{role.id}</td>
                          <td>{role.roleName}</td>
                          <td>{role.description}</td>
                          <td>
                            {role.permissions.map((per) => (
                              <div key={per.id}>
                                {languageType === "pa"
                                  ? per.psName
                                  : per.drName}
                              </div>
                            ))}
                          </td>
                          <td className="table-action">
                            <Tooltip
                              target=".custom-edit-btn"
                              content={t("shared.edit")}
                              position="top"
                            />
                            {authToken?.roles.includes("role_update") && (
                              <Link
                                onClick={() => handleEditClick(role)}
                                className="ms-3"
                              >
                                <FiEdit size={25} className="custom-edit-btn" />
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="card-footer">
                <Pagination totalRecords={roleCounts.totalElements} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoleList;
