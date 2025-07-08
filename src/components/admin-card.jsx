import { Link } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaRegBuilding } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi";
import { GiTeamIdea } from "react-icons/gi";
import useAxios from "../core/useAxios";
import { useTranslation } from "react-i18next";
const BarChart = lazy(() => import("./BarChart"));
const PieChart = lazy(() => import("./PieChart"));

const AdminCard = () => {
  const { t } = useTranslation();
  const [adminBarChartData, setAdminBarChartData] = useState(null);
  const [adminPieChartData, setAdminPieChartData] = useState(null);
  const [adminData, ,] = useAxios({
    url: "/admin/data",
  });

  useEffect(() => {
    if (adminData) {
      const barChartData = {
        labels: [
          t("mainLayout.sidebar.users"),
          t("mainLayout.sidebar.departments"),
          t("mainLayout.sidebar.qualifications"),
          t("mainLayout.dashboard.committeeMembers"),
        ],
        datasets: [
          {
            label: t("mainLayout.dashboard.adminData"),
            backgroundColor: [
              "rgba(54,162,235,0.4)",
              "rgba(255,206,86,0.4)",
              "rgba(153,102,255,0.4)",
              "rgba(228,141,236,0.4)",
            ],
            borderColor: [
              "rgba(54,162,235,0.3)",
              "rgba(255,206,86,0.3)",
              "rgba(153,102,255,0.3)",
              "rgba(255,159,64,0.3)",
            ],
            borderWidth: 2,
            data: [
              adminData.totalUsers,

              adminData.totalDepartments,
              adminData.totalRoles,
              adminData.committeeMembersDetailsList
                ? adminData.committeeMembersDetailsList.length
                : 0,
            ],
          },
        ],
      };
      setAdminBarChartData(barChartData);
    }
  }, [adminData]);
  useEffect(() => {
    if (adminData) {
      const pieChartData = {
        labels: [
          t("mainLayout.dashboard.activeUsers"),
          t("mainLayout.dashboard.inactiveUsers"),
        ],
        datasets: [
          {
            label: t("mainLayout.dashboard.adminData"),
            backgroundColor: ["rgba(75,192,192,0.7)", "rgba(255,0,0,0.7)"],
            borderColor: ["rgba(75,192,192,0.3)", "rgba(255,0,0,0.3)"],
            borderWidth: 2,
            data: [adminData.activeUsers, adminData.nonActiveUsers],
          },
        ],
      };
      setAdminPieChartData(pieChartData);
    }
  }, [adminData]);

  return (
    <>
      <div className="row">
        <div className="row" style={{ padding: '20px', fontFamily: "'Yakan', 'Lalezar', sans-serif" }} >
          {/* Card 1 */}
          <div className="col-sm-3" style={{ marginBottom: '20px' }}>
            <div className="card"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6e7dff, #2e4b7f)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* <div className="card-body" style={{ padding: '20px', color: '#fff' }}>
        <div className="row">
          <div className="col mt-0">
            <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {t("mainLayout.sidebar.users")}
            </h5>
          </div>
          <div className="col-auto">
            <div className="stat text-white">
              <FaUsers />
            </div>
          </div>
        </div>
        <h1 className="mt-1 mb-3" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {adminData.totalUsers}
        </h1>
        <div className="row mb-0">
          <div className="col">
            <span className="badge bg-success ms-2">{adminData.activeUsers}</span>
            <span className="badge bg-danger">{adminData.nonActiveUsers}</span>
          </div>
          <div className="col-auto">
            <Link to={"/users"} className="text-white" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
              {t("shared.details")}
            </Link>
          </div>
        </div>
      </div> */}
              <div
                className="card-body"
                style={{
                  padding: '20px',
                  color: '#2c3e50', // Dark grey text for readability
                  background:  'linear-gradient(to top, #ebbba7 0%, #cfc7f8 100%)', // Light blue gradient
                  borderRadius: '10px', // Slightly rounded corners for a modern look
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                }}
              >
                <div className="row">
                  <div className="col mt-0">
                    <h5
                      className="card-title"
                      style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0d47a1' }} // Dark blue for emphasis
                    >
                      {t("mainLayout.sidebar.users")}
                    </h5>
                  </div>
                  <div className="col-auto">
                    <div className="stat" style={{ color: '#0d47a1' }}>
                      <FaUsers />
                    </div>
                  </div>
                </div>
                <h1
                  className="mt-1 mb-3"
                  style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d47a1' }} // Consistent dark blue
                >
                  {adminData.totalUsers}
                </h1>
                <div className="row mb-0">
                  <div className="col">
                    <span className="badge bg-success ms-2">{adminData.activeUsers}</span>
                    <span className="badge bg-danger">{adminData.nonActiveUsers}</span>
                  </div>
                  <div className="col-auto">
                    <Link
                      to={"/users"}
                      className="text-primary"
                      style={{ textDecoration: 'underline', fontWeight: 'bold' }} // Blue text for links
                    >
                      {t("shared.details")}
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 2 */}
          <div className="col-sm-3" style={{ marginBottom: '20px' }}>
            <div className="card"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(to top, #209cff 0%, #68e0cf 100%)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }} 
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* <div className="card-body" style={{ padding: '20px', color: '#fff' }}>
        <div className="row">
          <div className="col mt-0">
            <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {t("mainLayout.sidebar.departments")}
            </h5>
          </div>
          <div className="col-auto">
            <div className="stat text-white">
              <FaRegBuilding />
            </div>
          </div>
        </div>
        <h1 className="mt-1 mb-3" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {adminData.totalDepartments}
        </h1>
        <div className="row mb-0">
          <div className="col"></div>
          <div className="col-auto">
            <Link to={"/departments"} className="text-white" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
              {t("shared.details")}
            </Link>
          </div>
        </div>
      </div> */}
              <div
                className="card-body"
                style={{
                  padding: '20px',
                  color: '#2c3e50', // Dark grey text for readability
                  background: 'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)', // Light blue gradient
                  borderRadius: '10px', // Slightly rounded corners for a modern look
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                }}
              >
                <div className="row">
                  <div className="col mt-0">
                    <h5
                      className="card-title"
                      style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0d47a1' }} // Dark green for emphasis
                    >
                      {t("mainLayout.sidebar.departments")}
                    </h5>
                  </div>
                  <div className="col-auto">
                    <div className="stat" style={{ color: '#0d47a1' }}>
                      <FaRegBuilding />
                    </div>
                  </div>
                </div>
                <h5
                  className="mt-1 mb-3"
                  style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d47a1' }} // Consistent dark green
                >
                  {adminData.totalDepartments}
                </h5>
                <div className="row mb-0">
                  <div className="col"></div>
                  <div className="col-auto">
                    <Link
                      to={"/departments"}
                      className="text-success"
                      style={{ textDecoration: 'underline', fontWeight: 'bold', color: '#0d47a1' }} // Green text for links
                    >
                      {t("shared.details")}
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3 */}
          <div className="col-sm-3" style={{ marginBottom: '20px' }}>
            <div className="card"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* <div className="card-body" style={{ padding: '20px', color: '#fff' }}>
        <div className="row">
          <div className="col mt-0">
            <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {t("mainLayout.sidebar.qualifications")}
            </h5>
          </div>
          <div className="col-auto">
            <div className="stat text-white">
              <GiHouseKeys />
            </div>
          </div>
        </div>
        <h1 className="mt-1 mb-3" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {adminData.totalRoles}
        </h1>
        <div className="row mb-0">
          <div className="col"></div>
          <div className="col-auto">
            <Link to={"/roles"} className="text-white" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
              {t("shared.details")}
            </Link>
          </div>
        </div>
      </div> */}
              <div
                className="card-body"
                style={{
                  padding: '20px',
                  color: '#2c3e50', // Dark grey text for readability
                  background: 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)', // Light blue gradient
                  borderRadius: '10px', // Slightly rounded corners for a modern look
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                }}
              >
                <div className="row">
                  <div className="col mt-0">
                    <h5
                      className="card-title"
                      style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0d47a1' }} // Deep purple for emphasis
                    >
                      {t("mainLayout.sidebar.qualifications")}
                    </h5>
                  </div>
                  <div className="col-auto">
                    <div className="stat" style={{ color: '#0d47a1' }}>
                      <GiHouseKeys />
                    </div>
                  </div>
                </div>
                <h1
                  className="mt-1 mb-3"
                  style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d47a1' }} // Consistent deep purple
                >
                  {adminData.totalRoles}
                </h1>
                <div className="row mb-0">
                  <div className="col"></div>
                  <div className="col-auto">
                    <Link
                      to={"/roles"}
                      className="text-purple"
                      style={{ textDecoration: 'underline', fontWeight: 'bold', color: '#0d47a1' }} // Purple text for links
                    >
                      {t("shared.details")}
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 4 */}
          <div className="col-sm-3" style={{ marginBottom: '20px' }}>
            <div className="card"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff9a8b, #fcbf49)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="card-body" style={{
                padding: '20px',
                color: '#2c3e50', // Dark grey text for readability
                background: 'linear-gradient(to top, #fddb92 0%, #d1fdff 100%)', // Light blue gradient
                borderRadius: '10px', // Slightly rounded corners for a modern look
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
              }}>
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#0d47a1' }}>
                      {/* {t("mainLayout.dashboard.committeeMembers")} */}
                      خدمتونه
                    </h5>
                  </div>
                  <div className="col-auto">
                    <div className="stat text-white" style={{ color: '#0d47a1' }}>
                      <GiTeamIdea />
                    </div>
                  </div>
                </div>
                <h1 className="mt-1 mb-3" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d47a1' }}>
                  {adminData.committeeMembersDetailsList
                    ? adminData.committeeMembersDetailsList.length
                    : 0}
                </h1>
                <div className="row mb-0">
                  <div className="col"></div>
                  <div className="col-auto">
                    <Link to={"/committee-members"} className="text-white" style={{ textDecoration: 'underline', fontWeight: 'bold', color: '#0d47a1' }}>
                      {t("shared.details")}
                    </Link>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>

      </div>
      <div className="row">
        <div className="col-sm-12 col-md-4">
          <div className="card">
            <div className="card-body">
              {adminPieChartData && <PieChart chartData={adminPieChartData} />}
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              {adminBarChartData && <BarChart chartData={adminBarChartData} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCard;
