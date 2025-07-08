import { Tooltip } from "primereact/tooltip";
import { Link, useNavigation } from "react-router-dom";
import Spinner from "../../../../components/spinner";
import { FaUsersLine } from "react-icons/fa6";
import emptyFolder from "@assets/images/emptyFolder.jpeg";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import Loading from "../../../../components/loading";

const CommitteeDepartmentList = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const httpInterceptedService = useHttpInterceptedService();
  const [committeeDepartments, setCommitteeDepartments] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCommitteeDepartments = async () => {
      try {
        const response = await httpInterceptedService.get("/user/departments", {
          signal: controller.signal,
        });
        isMounted && setCommitteeDepartments(response.data);
      } catch (error) {
        console.error("Error fetching committee departments:", error);
      } finally {
        setLoading(false);
      }
    };
    getCommitteeDepartments();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <div className="card">
              <div className="card-header bg-dark">
                <h3 className="text-light">
                  {t("department.committeeDepList")}
                </h3>
              </div>
              {navigation.state !== "idle" && <Spinner />}
              <div className="card-body" style={{ overflowX: "auto" }}>
                <table className="table table-striped">
                  <thead className="font-weight-bold">
                    <tr>
                      <th>{t("department.depNum")}</th>
                      <th>{t("department.depName")}</th>
                      <th>{t("shared.details")}</th>
                      <th>{t("department.numOfMembers")}</th>
                      <th>{t("shared.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committeeDepartments.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ textAlign: "center" }}>
                          <div className="empty-result">
                            <img
                              src={emptyFolder}
                              alt="Not Found"
                              width={100}
                            />
                            <p className="alert-warning text-center mt-3">
                              {t("department.emptyList")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      committeeDepartments.map((department) => {
                        return (
                          <tr key={department.depId}>
                            <td>{department.depId}</td>
                            <td>{department.depName}</td>
                            <td>{department.description}</td>
                            <td>
                              <span className="badge bg-info">
                                {department.usercount}
                              </span>
                            </td>
                            <td className="table-action">
                              <Tooltip
                                target=".view-members"
                                content={t("department.depMembers")}
                                position="top"
                              />
                              <Link
                                to={`/department-members/${department.depId}`}
                                className="ms-3"
                              >
                                <FaUsersLine
                                  size={25}
                                  className="view-members"
                                />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommitteeDepartmentList;
