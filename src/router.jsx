import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
const IdentityLayout = lazy(() => import("./layouts/identity-layout"));
const MainLayout = lazy(() => import("./layouts/mainLayout/main-layout"));
import Login from "./features/identity/components/login/Login";
import { elements } from "chart.js";
import { useTranslation } from "react-i18next";
const DocumentDetails = lazy(() =>
  import("./features/documents/components/document-details")
);
const ServicesForm=lazy(()=>
  import("./features/services/services-form")
)
const Services=lazy(()=>
import("./features/services/services")
)
const UserDetails = lazy(() =>
  import("./features/users/components/user-details")
);
const Profile = lazy(() =>
  import("./features/users/components/profile/users-profile")
);
const SentDocumentDetails = lazy(() =>
  import("./features/documents/components/sent-documents/sent-document-details")
);
const ReceivedDocumentDetails = lazy(() =>
  import(
    "./features/documents/components/received-documents/received-document-details"
  )
);
const PersistLogin = lazy(() => import("./features/hooks/PersistLogin"));
const DocumentList = lazy(() =>
  import("./features/documents/components/document-list")
);
const ReceivedDocumentList = lazy(() =>
  import(
    "./features/documents/components/received-documents/received-document-list"
  )
);
const SentDocumentList = lazy(() =>
  import("./features/documents/components/sent-documents/sent-document-list")
);
const RoleList = lazy(() =>
  import("./features/users/components/roles/roles-list")
);
const CommitteeDepartmentList = lazy(() =>
  import("./features/department/components/committee/committee-department-list")
);
const UserList = lazy(() =>
  import("./features/users/components/list/users-list")
);
const ReferenceList = lazy(() =>
  import("./features/documents/components/reference/reference-list")
);
const ReferenceProvider = lazy(() =>
  import("./features/documents/components/reference/reference-context").then(
    (module) => {
      return { default: module.ReferenceProvider };
    }
  )
);
const DepartmentActivityLogs = lazy(() =>
  import("./features/audit-log/department-activity-logs")
);
const IdentityUnhandledException = lazy(() =>
  import("./pages/identity-unhandled-exception")
);
const ActivityLogs = lazy(() => import("./features/audit-log/activity-logs"));
const ExpiredDocuments = lazy(() =>
  import(
    "./features/documents/components/sent-documents/expired-documents-list"
  )
);
const BackupList = lazy(() => import("./features/backup/backup-list"));
const CreateDocument = lazy(() =>
  import("./features/documents/components/create-document")
);

const Register = lazy(() =>
  import("./features/users/components/register/Register")
);
const DepartmentList = lazy(() =>
  import("./features/department/components/department-list")
);
const UnhandledException = lazy(() => import("./pages/unhandled-exception"));
const NotFound = lazy(() => import("./pages/not-found"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const RequireAuth = lazy(() => import("./components/require-auth"));
const Unauthorized = lazy(() => import("./pages/unauthorized"));
const DepartmentChart = lazy(() =>
  import("./features/department/components/department-chart")
);
const DepartmentProvider = lazy(() =>
  import("./features/department/department-context").then((module) => {
    return { default: module.DepartmentProvider };
  })
);
const RoleProvider = lazy(() =>
  import("./features/users/components/roles/role-context").then((module) => {
    return { default: module.RoleProvider };
  })
);
const ForgotPassword = lazy(() =>
  import("./features/users/components/forgot-password")
);
const CheckOtp = lazy(() => import("./features/users/components/check-otp"));
const EmailProvider = lazy(() =>
  import("./contexts/email/email-context").then((module) => {
    return { default: module.EmailProvider };
  })
);
const DepartmentMembers = lazy(() =>
  import("./features/department/components/department-members")
);
const CommitteeMembers = lazy(() =>
  import("./features/department/components/committee/committee-members")
);

const router = createBrowserRouter([
  {
    element: <PersistLogin />,
    children: [
      {
        element: (
          <RequireAuth
            allowedRoles={[
              "department_creation",
              "user_creation",
              "document_inbox",
              "document_outbox",
              "document_creation",
              "document_view",
              "document_share",
              "document_outbox",
              "document_update",
              "report_add",
              "report_view",
              "comment_view",
              "comment_add",
              "secret_view",
            ]}
          />
        ),
        children: [
          {
            path: "/",
            element: <MainLayout />,
            errorElement: <UnhandledException />,
            children: [
              {
                index: "true",
                element: <Dashboard />,
              },
                {
                    path: "ServicesForm",
                    element: <ServicesForm />,
              },
              ,
                {
                    path: "Services",
                    element: <Services />,
              },
              
              {
                element: <RequireAuth allowedRoles={["document_view"]} />,
                children: [
                  {
                    path: "documents",
                    element: <DocumentList />,
                  },
                ],
              },
              {
                element: (
                  <RequireAuth
                    allowedRoles={["document_share", "document_update"]}
                  />
                ),
                children: [
                  {
                    path: "documents/:id",
                    element: <DocumentDetails />,
                  },
                ],
              },
              {
                element: <RequireAuth allowedRoles={["document_inbox"]} />,
                children: [
                  {
                    path: "incoming-documents",
                    element: <ReceivedDocumentList />,
                  },
                ],
              },
              {
                path: "incoming-documents/:id",
                element: <ReceivedDocumentDetails />,
              },
              {
                element: <RequireAuth allowedRoles={["document_outbox"]} />,
                children: [
                  {
                    path: "outgoing-documents",
                    element: <SentDocumentList />,
                  },
                ],
              },
              {
                path: "outgoing-documents/:id",
                element: <SentDocumentDetails />,
              },

              {
                element: <RequireAuth allowedRoles={["document_creation"]} />,
                children: [
                  {
                    path: "create-document",
                    element: <CreateDocument />,
                  },
                ],
              },
              {
                element: (
                  <RequireAuth
                    allowedRoles={["view_all_document_references"]}
                  />
                ),
                children: [
                  {
                    path: "references",
                    element: (
                      <ReferenceProvider>
                        <ReferenceList />
                      </ReferenceProvider>
                    ),
                  },
                ],
              },
              {
                element: (
                  <RequireAuth allowedRoles={["view_expired_document_list"]} />
                ),
                children: [
                  { path: "expired-documents", element: <ExpiredDocuments /> },
                ],
              },
              {
                element: (
                  <RequireAuth
                    allowedRoles={["backup_List", "backup_creation"]}
                  />
                ),
                children: [{ path: "backups", element: <BackupList /> }],
              },
              {
                element: <RequireAuth allowedRoles={["log_view"]} />,
                children: [{ path: "logs", element: <ActivityLogs /> }],
              },
              {
                element: (
                  <RequireAuth allowedRoles={["log_view_DepartmentWise"]} />
                ),
                children: [
                  {
                    path: "department-logs",
                    element: <DepartmentActivityLogs />,
                  },
                ],
              },
              {
                element: (
                  <RequireAuth allowedRoles={["all_departments_view"]} />
                ),
                children: [
                  {
                    path: "departments",
                    element: (
                      <DepartmentProvider>
                        <DepartmentList />
                      </DepartmentProvider>
                    ),
                  },
                ],
              },
              {
                path: "department-members/:depId",
                element: <DepartmentMembers />,
              },
              {
                element: <RequireAuth allowedRoles={["committee_member"]} />,
                children: [
                  {
                    path: "committee-departments",
                    element: <CommitteeDepartmentList />,
                  },
                  {
                    path: "committee-members",
                    element: <CommitteeMembers />,
                  },
                ],
              },
              {
                path: "department-chart",
                element: <DepartmentChart />,
              },
              {
                element: <RequireAuth allowedRoles={["user_all"]} />,
                children: [
                  {
                    path: "users",
                    element: <UserList />,
                  },
                ],
              },
              {
                element: <RequireAuth allowedRoles={["user_edit"]} />,
                children: [
                  {
                    path: "users/:id",
                    element: <UserDetails />,
                  },
                ],
              },
              {
                element: <RequireAuth allowedRoles={["user_creation"]} />,
                children: [
                  {
                    path: "users/register-user",
                    element: <Register />,
                    errorElement: <Register />,
                  },
                ],
              },
              {
                element: <RequireAuth allowedRoles={["role_list"]} />,
                children: [
                  {
                    path: "roles",
                    element: (
                      <RoleProvider>
                        <RoleList />
                      </RoleProvider>
                    ),
                  },
                ],
              },
              {
                path: "users-profile/:id",
                element: <Profile />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <IdentityLayout />,
    errorElement: <IdentityUnhandledException />,
    children: [
      {
        path: "login",
        element: <Login />,
        errorElement: <Login />,
      },
      {
        path: "forgot-password",
        element: (
          <EmailProvider>
            <ForgotPassword />
          </EmailProvider>
        ),
      },
      {
        path: "check-otp",
        element: (
          <EmailProvider>
            <CheckOtp />
          </EmailProvider>
        ),
      },
      {
        path: "reset-password",
        lazy: () =>
          import("./features/users/components/reset-password").then(
            (module) => ({
              action: module.resetPasswordAction,
              Component: module.default,
            })
          ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<p className="text-info">در حال بارگذاری ...</p>}>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: "unauthorized",
    element: (
      <Suspense fallback={<p className="text-info">در حال بارگذاری ...</p>}>
        <Unauthorized />
      </Suspense>
    ),
  },
]);

export default router;
