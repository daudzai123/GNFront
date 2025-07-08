import { lazy } from "react";
const AdminCard = lazy(() => import("../components/admin-card"));
import useAuth from "../features/hooks/use-auth";
const NewReceivedDocuments = lazy(() =>
  import(
    "../features/documents/components/received-documents/new-received-documents"
  )
);
const CommitteeCard = lazy(() => import("../components/committee-card"));

const Dashboard = () => {
  const { auth } = useAuth();

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-12">
          {auth?.userType === "MEMBER_OF_DEPARTMENT" ||
          auth?.userType === "MEMBER_OF_COMMITTEE" ? (
            <CommitteeCard />
          ) : auth?.userType === "ADMIN" ? (
            <AdminCard />
          ) : null}
        </div>
      </div>
      <div className="row" style={{ height: "auto" }}>
        <div className="col-12">
          {auth?.userType === "MEMBER_OF_DEPARTMENT" ? (
            <NewReceivedDocuments />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
