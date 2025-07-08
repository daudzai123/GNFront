import { useTranslation } from "react-i18next";
import logo from "@assets/images/logo.png";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { useAppContext } from "../../contexts/app/app-context";
import { BsBuilding } from "react-icons/bs";
import { BsBuildings } from "react-icons/bs";
import { ImTree } from "react-icons/im";
import useAuth from "../../features/hooks/use-auth";
import { IoHomeOutline } from "react-icons/io5";
import { IoFolderOpenOutline } from "react-icons/io5";
import { TbFolderDown, TbFolderUp } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { LuDatabaseBackup } from "react-icons/lu";
import { GoPasskeyFill } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";
import { LuFileClock } from "react-icons/lu";
import { RxActivityLog } from "react-icons/rx";
import { FaServicestack, FaUsersViewfinder } from "react-icons/fa6";
import { GoCrossReference } from "react-icons/go";
import useAuthToken from "../../features/hooks/use-authToken";
import { color } from "chart.js/helpers";
import ServicesForm from "../../features/services/services-form";

const Sidebar = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { authToken } = useAuthToken();
  const { showSidebar, toggleSidebar } = useAppContext();
  const sidebarClassname = ({ isActive }) =>
    isActive ? "sidebar-link" : "sidebar-link";

  const handleSidebarItemClick = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      toggleSidebar();
    }
  };

  const depId = auth?.departments[0]?.depId;
  const isCommitteeMember = auth?.userType === "MEMBER_OF_COMMITTEE";
  const isDepartmentMember = auth?.userType === "MEMBER_OF_DEPARTMENT";
  const isAdmin = auth?.userType === "ADMIN";

  return (
    <nav className={`sidebar ${!showSidebar ? "collapsed" : ""}`} style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="sidebar-content ">
        <Link
          to={"/"}
          className="sidebar-brand shadow-sm d-flex flex-column align-items-center pt-0 mb-0 mt-1"
        >
          <img src={logo} style={{ height: "90px" }}   />
          <p className="mb-0 text-black hover:border-2 hover:bg-black" style={{ fontSize: "90%" }}>
            {t("title")}
          </p>
        </Link>
        
        
        
        {authToken?.roles.includes("document_creation") && (
          <>
            {/* <div className="d-flex align-items-center justify-content-center mb-3">
            <Link
                to={"/create-document"}
                className="btn btn-primary fw-bolder mt-n1"
                onClick={handleSidebarItemClick}
              >
                
              <Link
                 to={"/create-document"}
                className="btn btn-primary fw-bolder  mt-n1"
                onClick={handleSidebarItemClick}
              >
              
                <IoIosAdd size={24} />
                {t("mainLayout.sidebar.createDocument")}
              </Link>
              </Link>
            </div> */}
     <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
  <Link
    to="/create-document"
    onClick={handleSidebarItemClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#007bff",
      color: "white",
      fontWeight: "bold",
      padding: "10px 20px",
      borderRadius: "10px",
      textDecoration: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.2s ease, transform 0.2s ease"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = "#0056b3";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = "#007bff";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <IoIosAdd size={20} style={{ marginRight: "8px" }} />
    {t("mainLayout.sidebar.createDocument")}
  </Link>
  
</div>

          </>
        )}
        
        <ul className="sidebar-nav pe-0 ">
          {authToken?.roles.some((role) =>
            ["document_inbox", "document_outbox", "document_list"].includes(
              role
            )
          ) && (
            <li className="sidebar-header shadow-sm fw-bolder fs-lg">
              {t("mainLayout.sidebar.documentManagement")}
            </li>
          )}
          <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
            <NavLink className={sidebarClassname} to={"/"}>
              <IoHomeOutline size={22} className="align-middle me-2" />
              <span className="align-middle me-2">
                {t("mainLayout.sidebar.home")}
              </span>
            </NavLink>
          </li>
          
          {authToken?.roles.includes("document_list") && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              <NavLink className={sidebarClassname} to={"/documents"}>
             
                <IoFolderOpenOutline size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("shared.documentList")}
                </span>
              </NavLink>
            </li>
          )}
          {authToken?.roles.includes("document_inbox") && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
                         <NavLink className={sidebarClassname} to={"/incoming-documents"}>
             
                <TbFolderDown size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.incomingDocuments")}
                </span>
              </NavLink>
            </li>
          )}
          {authToken?.roles.includes("document_outbox") && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
                  <NavLink className={sidebarClassname} to={"/outgoing-documents"}>
  
                <TbFolderUp size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.outgoingDocuments")}
                </span>
              </NavLink>
            </li>
          )}
          {authToken?.roles.includes("view_expired_document_list") ||
          isCommitteeMember ? (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
                  <NavLink className={sidebarClassname} to={"/expired-documents"}>
             
                <LuFileClock size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.deadlineExpiredDocuments")}
                </span>
              </NavLink>
            </li>
          ) : null}

          {authToken?.roles.includes("all_departments_view") && (
            <>
              <li className="sidebar-header shadow-sm fw-bolder fs-lg">
                {t("mainLayout.sidebar.departmentManagement")}
              </li>
              <li className="sidebar-item custom-li" onClick={handleSidebarItemClick}>
                <NavLink className={sidebarClassname} to={"/departments"}>
                  <BsBuilding size={22} className="align-middle me-2" />
                  <span className="align-middle me-2">
                    {t("mainLayout.sidebar.departments")}
                  </span>
                </NavLink>
              </li>
              <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
                <NavLink className={sidebarClassname} to={"/department-chart"}>
                  <ImTree size={22} className="align-middle me-2" />
                  <span className="align-middle me-2">
                    {t("mainLayout.sidebar.organization")}
                  </span>
                </NavLink>
              </li>
            </>
          )}
          {authToken?.roles.includes("committee_member") ||
          isCommitteeMember ? (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              <NavLink
                className={sidebarClassname}
                to={"/committee-departments"}
              >
                <BsBuildings size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.myDepartments")}
                </span>
              </NavLink>
            </li>
          ) : null}
          {isDepartmentMember && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              <NavLink
                className={sidebarClassname}
                to={`/department-members/${depId}`}
              >
                <BsBuilding size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.partners")}
                </span>
              </NavLink>
            </li>
          )}
          {authToken?.roles.includes("committee_member") && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              <NavLink className={sidebarClassname} to="/committee-members">
                <FaUsersViewfinder size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.dashboard.committeeMembers")}
                </span>
              </NavLink>
            </li>
          )}
          {authToken?.roles.some((role) =>
            ["user_all", "role_list"].includes(role)
          ) && (
            <li className="sidebar-header shadow-sm fw-bolder fs-lg">
              {t("mainLayout.sidebar.userManagement")}
            </li>
          )}
          {authToken?.roles.includes("user_all") && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              <NavLink className={sidebarClassname} to={"/users"}>
                <HiOutlineUsers size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.users")}
                </span>
              </NavLink>
            </li>
          )}
          {authToken?.roles.includes("role_list") && (
            <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              <NavLink className={sidebarClassname} to={"/roles"}>
                <GoPasskeyFill size={22} className="align-middle me-2" />
                <span className="align-middle me-2">
                  {t("mainLayout.sidebar.qualifications")}
                </span>
              </NavLink>
            </li>
          )}

          {authToken?.roles.includes("backup_List") || isAdmin ? (
            <>
              <li className="sidebar-header shadow-sm fw-bolder fs-lg">
                {t("mainLayout.sidebar.databaseManagement")}
              </li>
              <li className="sidebar-item" onClick={handleSidebarItemClick}>
              {/* <NavLink className={sidebarClassname} to={"/backups"}> bellow code comment */}
              <NavLink className={sidebarClassname} to={"/backups"}>
                  <LuDatabaseBackup size={22} className="align-middle me-2" />
                  <span className="align-middle me-2">
                    {t("mainLayout.sidebar.backupList")}
                  </span>
                </NavLink>
              </li>
            </>
          ) : null}
          {authToken?.roles.includes("log_view") || isAdmin ? (
            <>
              <li className="sidebar-header shadow-sm fw-bolder fs-lg">
                {t("mainLayout.sidebar.activityLog")}
              </li>
              <li className="sidebar-item" onClick={handleSidebarItemClick}>
              {/* <NavLink className={sidebarClassname} to={"/logs"}> */}
              <NavLink className={sidebarClassname} to={"/logs"}>
                  <RxActivityLog size={22} className="align-middle me-2" />
                  <span className="align-middle me-2">
                    {t("mainLayout.sidebar.activityList")}
                  </span>
                </NavLink>
              </li>
            </>
          ) : null}
 <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
            <NavLink className={sidebarClassname} to={"/ServicesForm"}>
              <FaServicestack  size={22} className="align-middle me-2" />
              <span className="align-middle me-2">
                {t("service.service_Form")}
                
              </span>
            </NavLink>
          </li>
           <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
            <NavLink className={sidebarClassname} to={"/Services"}>
              <FaServicestack  size={22} className="align-middle me-2" />
              <span className="align-middle me-2">
                {/* {t("mainLayout.sidebar.home")} */}
                 {t("service.service")}
              </span>
            </NavLink>
          </li>
          {authToken?.roles.includes("view_all_document_references") && (
            <>
              <li className="sidebar-header shadow-sm fw-bolder fs-lg">
                {/* {t("mainLayout.sidebar.referenceManagement")} */}
              </li>
              <li className="sidebar-item" onClick={handleSidebarItemClick}>
              {/* <NavLink className={sidebarClassname} to={"/references"}> */}
                <NavLink className={sidebarClassname} >
                  {/* <GoCrossReference size={22} className="align-middle me-2" /> */}
                  <span className="align-middle me-2">
                    {/* {t("shared.referenceImpl")} */}
                  </span>
                </NavLink>
              </li>
            </>
          )}
          
          {authToken?.roles.includes("log_view_DepartmentWise") ||
          isCommitteeMember ? (
            <>
              <li className="sidebar-header shadow-sm fw-bolder fs-lg">
                {t("mainLayout.sidebar.activityLog")}
              </li>
              <li className="sidebar-item shadow-sm" onClick={handleSidebarItemClick}>
              {/* <NavLink className={sidebarClassname} to={"/department-logs"}> */}
              <NavLink className={sidebarClassname} to={"/department-logs"}>
                  <RxActivityLog size={22} className="align-middle me-2" />
                  <span className="align-middle me-2">
                    {t("mainLayout.sidebar.activityList")}
                  </span>
                </NavLink>
              </li>
            </>
          ) : null}
          
          
        </ul>
         
      </div>
    </nav>
  );
};

export default Sidebar;
