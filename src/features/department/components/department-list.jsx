import { Tooltip } from "primereact/tooltip";
import { lazy, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDepartmentContext } from "../department-context";
import Pagination from "../../../components/pagination";
import Spinner from "../../../components/spinner";
import { FiEdit } from "react-icons/fi";
import { FaUsersLine } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import SearchBar from "../../../components/searchBar";
import { LuBuilding2 } from "react-icons/lu";
const CreateDepartment = lazy(() =>
  import("../../../features/department/components/create-department")
);
import { IoIosAdd } from "react-icons/io";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";
import notFound from "../../../assets/images/notfound.jpeg";
import Loading from "../../../components/loading";
import useAuthToken from "../../hooks/use-authToken";
const UpdateDepartment = lazy(() => import("./update-department"));

const DepartmentList = () => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const { department, setDepartment } = useDepartmentContext();
  const [showUpdateDepartment, setShowUpdateDepartment] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [depCounts, setDepCounts] = useState([]);
  const [searchResultFound, setSearchResultFound] = useState(true);
  const httpInterceptedService = useHttpInterceptedService();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  let url = "/department/all";
  url += `?page=${page}&size=${size}`;
  let isMounted = true;
  const controller = new AbortController();
  const getDepartments = async () => {
    try {
      const response = await httpInterceptedService.get(url, {
        signal: controller.signal,
      });
      isMounted && setDepartments(response.data?.content);
      setDepCounts(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    getDepartments();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [department, showAddDepartment, searchParams]);

  const handleEditClick = (department) => {
    setShowUpdateDepartment(true);
    setDepartment(department);
  };

  // Search
  const searchDepartments = async (term) => {
    setSearchLoading(true);
    try {
      const response = await httpInterceptedService.get(
        `/department/search${term ? "?searchItem=" + term : ""}`
      );
      if (response && response.data.length > 0) {
        setDepartments(response.data);
        setSearchResultFound(true);
      } else {
        setDepartments([]);
        setSearchResultFound(false);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchDepartments = () => {
    getDepartments();
    setSearchResultFound(true);
    setSearchLoading(true);
  };

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          {department && showUpdateDepartment && (
            <UpdateDepartment
              showUpdateDepartment={showUpdateDepartment}
              setShowUpdateDepartment={setShowUpdateDepartment}
            />
          )}
          {showAddDepartment && (
            <CreateDepartment setShowAddDepartment={setShowAddDepartment} />
          )}
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <div className="card" >
              <div className="card-header" style={{background:'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)'}}>
                <h3 className="text-dark border-bottom border-secondary pb-2">
                  {t("department.depList")}
                </h3>
                <div className="row mt-3">
                  <div className="col-md-6 col-sm-10 mb-3 mb-md-0">
                    <SearchBar searchItems={searchDepartments} />
                  </div>
                  <div className="col-md-6 col-sm-10 d-flex justify-content-md-end">
                    {authToken?.roles.includes("department_creation") && (
                      <button
                        onClick={() => setShowAddDepartment(true)}
                        className="btn btn-lg btn-primary ms-2"
                      >
                        <IoIosAdd size={25} />
                        {t("department.newDepartment")}
                      </button>
                    )}
                    <button
                      className="btn btn-lg btn-info"
                      onClick={fetchDepartments}
                    >
                      <LuBuilding2 size={17} className="ms-1" />
                      {t("department.allDepartments")}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ overflowX: "auto" ,padding:0,margin:0 }}>
                <table className="table table-striped" style={{background:'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)'}}>
                  <thead className="font-weight-bold" > 
                    <tr style={{color:'white' }} className="bg-primary">
                      <th>{t("department.depNum")}</th>
                      <th>{t("department.depName")}</th>
                      <th>{t("shared.details")}</th>
                      <th>{t("department.seniorDep")}</th>
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
                      <tr>
                        <td colSpan="8" style={{textAlign: "center"}}>
                          <div className="empty-result">
                            <img src={notFound} alt="Not Found" width={100} />
                            <p className="alert-warning text-center mt-3">
                              {t("shared.notFound")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      departments.map((department) => {
                        return (
                          <tr key={department.depId} >
                            <td>{department.depId}</td>
                            <td>{department.depName}</td>
                            <td>
                              {department.description
                                ? department.description
                                : "-"}
                            </td>
                            <td>
                              {department.parent
                                ? department.parent?.depName
                                : "-"}
                            </td>
                            <td className="table-action">
                              <Tooltip
                                target=".custom-edit-icon"
                                content={t("shared.edit")}
                                position="top"
                              />
                              {authToken?.roles?.includes(
                                "department_update"
                              ) && (
                                <Link
                                  onClick={() => handleEditClick(department)}
                                  className="ms-3"
                                >
                                  <FiEdit
                                    size={25}
                                    className="custom-edit-icon"
                                  />
                                </Link>
                              )}
                              <Tooltip
                                target=".custom-view-icon"
                                content={t("department.depMembers")}
                                position="top"
                              />
                              <Link
                                to={`/department-members/${department.depId}`}
                                className="ms-3"
                              >
                                <FaUsersLine
                                  size={25}
                                  className="custom-view-icon"
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
              {searchResultFound && (
                <div className="card-footer">
                  <Pagination totalRecords={depCounts.totalElements} />
                </div>
              )}
            </div>
           
          )}
        </div>

        
      </div>
    </>
  );
};

export default DepartmentList;
