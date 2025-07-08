import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../components/loading";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const CommitteeMembers = () => {
  const { t } = useTranslation();
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const httpInterceptedService = useHttpInterceptedService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await httpInterceptedService.get("/admin/data");
        setCommitteeMembers(data.committeeMembersDetailsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching committee members:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}> 
        <div className="col-12 mt-2">
          {loading ? (
            <Loading theme="primary" />
          ) : (
            <div className="card">
              <div className="card-header bg-dark">
                <h3 className="text-light">
                  {t("department.committeeMemberList")}
                </h3>
              </div>

              <div className="card-body" style={{ overflowX: "auto" }}>
                <table className="table table-striped">
                  <thead className="font-weight-bold">
                    <tr>
                      <th>{t("department.nameLastname")}</th>
                      <th>{t("login.email")}</th>
                      <th>{t("department.departments")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committeeMembers.map((user, index) => (
                      <tr key={index}>
                        <td>
                          {user.firstName} {user.lastName}
                        </td>
                        <td>{user.email}</td>
                        <td>{user.depName.join(", ")}</td>
                      </tr>
                    ))}
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

export default CommitteeMembers;
