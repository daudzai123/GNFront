// import { useEffect, useState } from "react";
// import { Tooltip } from "primereact/tooltip";
// import { LuDatabaseBackup } from "react-icons/lu";
// import backup from "@assets/images/backup.jpeg";
// import { Link } from "react-router-dom";
// import { FcDataBackup } from "react-icons/fc";
// import { toast } from "react-toastify";
// import Loading from "../../components/loading";
// import { useTranslation } from "react-i18next";
// import useHttpInterceptedService from "../hooks/use-httpInterceptedService";
// import useAuthToken from "../hooks/use-authToken";

// const BackupList = () => {
//   const { t } = useTranslation();
//   const { authToken } = useAuthToken();
//   const [backups, setBackups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const httpInterceptedService = useHttpInterceptedService();

//   const fetchBackups = async () => {
//     try {
//       const response = await httpInterceptedService.get("/backup/all");
//       if (response.status === 200) {
//         setBackups(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching backups:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBackups();
//   }, []);

//   const takeBackup = async () => {
//     try {
//       const response = await httpInterceptedService.get("/backup/create");
//       if (response.status === 200) {
//         toast.success(t("toast.createBackupSuccess"), {
//           position: toast.POSITION.BOTTOM_LEFT,
//         });
//         fetchBackups();
//       } else {
//         toast.error(t("toast.createBackupFailure"), {
//           position: toast.POSITION.BOTTOM_LEFT,
//         });
//       }
//     } catch (error) {
//       console.error("Error take backup:", error);
//     }
//   };

//   const takeBackupByPath = async (backupPath) => {
//     try {
//       const response = await httpInterceptedService.get(
//         `/backup/${backupPath}`
//       );
//       if (response.status === 200) {
//         const downloadUrl = response.data;
//         window.open(downloadUrl, "_blank");
//       }
//     } catch (error) {
//       console.error("Error take backup by path:", error);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <Loading theme="primary" />
//       ) : (
//         <div className="card" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
//           <div className="card-header bg-dark">
//             <div className="d-flex align-items-center justify-content-between">
//               <h3 className="text-light">{t("backup.backupList")}</h3>
//               {authToken?.roles.includes("backup_creation") && (
//                 <button className="btn btn-primary" onClick={takeBackup}>
//                   <LuDatabaseBackup size={20} className="ms-2" />
//                   {t("backup.createBackup")}
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="card-body" style={{ overflowX: "auto" }}>
//             <table className="table table-striped">
//               <thead className="font-weight-bold">
//                 <tr>
//                   <th>{t("backup.path")}</th>
//                   <th>{t("backup.time")}</th>
//                   <th>{t("backup.creator")}</th>
//                   <th>{t("backup.creatorPhone")}</th>
//                   <th>{t("shared.actions")}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {backups.length ? (
//                   backups.map((backup) => {
//                     const convertedBackupDate = new Date(backup.created_at)
//                       .toLocaleTimeString("fa-Persian", {
//                         year: "numeric",
//                         month: "numeric",
//                         day: "numeric",
//                         calendar: "islamic-umalqura",
//                       })
//                       .replace(/\//g, "-");
//                     return (
//                       <tr key={backup.id}>
//                         <td>{backup.backupPath}</td>
//                         <td>{convertedBackupDate}</td>
//                         <td>
//                           {backup.creator.firstName}
//                           {backup.creator.lastName}
//                         </td>
//                         <td>
//                           {backup.creator.phoneNo
//                             ? backup.creator.phoneNo
//                             : "-"}
//                         </td>
//                         <td className="table-action">
//                           <Tooltip
//                             target=".take-backup"
//                             content={t("backup.downloadBackup")}
//                             position="top"
//                           />
//                           <Link
//                             onClick={() => takeBackupByPath(backup.backupPath)}
//                             className="ms-3"
//                           >
//                             <FcDataBackup size={25} className="take-backup" />
//                           </Link>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="10" style={{ textAlign: "center" }}>
//                       <div className="empty-result">
//                         <img src={backup} alt="Not Found" width={100} />
//                         <p className="alert-warning text-center mt-3">
//                           {t("backup.emptyBackupList")}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default BackupList;

import { useEffect, useState } from "react";
import { Tooltip } from "primereact/tooltip";
import { LuDatabaseBackup } from "react-icons/lu";
import backup from "@assets/images/backup.jpeg";
import { Link } from "react-router-dom";
import { FcDataBackup } from "react-icons/fc";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../hooks/use-httpInterceptedService";
import useAuthToken from "../hooks/use-authToken";

const BackupList = () => {
  const { t } = useTranslation();
  const { authToken } = useAuthToken();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const httpInterceptedService = useHttpInterceptedService();

  const fetchBackups = async () => {
    try {
      const response = await httpInterceptedService.get("/backup/all");
      if (response.status === 200) {
        setBackups(response.data);
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const takeBackup = async () => {
    try {
      const response = await httpInterceptedService.get("/backup/create");
      if (response.status === 200) {
        toast.success(t("toast.createBackupSuccess"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
        fetchBackups();
      } else {
        toast.error(t("toast.createBackupFailure"), {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      }
    } catch (error) {
      console.error("Error take backup:", error);
    }
  };

  const takeBackupByPath = async (backupPath) => {
    try {
      const response = await httpInterceptedService.get(
        `/backup/${backupPath}`,
        { responseType: "blob" }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", backupPath); // د فایل نوم ورکول
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error take backup by path:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading theme="primary" />
      ) : (
        <div className="card" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
          <div className="card-header bg-dark">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="text-light">{t("backup.backupList")}</h3>
              {authToken?.roles.includes("backup_creation") && (
                <button className="btn btn-primary" onClick={takeBackup}>
                  <LuDatabaseBackup size={20} className="ms-2" />
                  {t("backup.createBackup")}
                </button>
              )}
            </div>
          </div>
          <div className="card-body" style={{ overflowX: "auto" }}>
            <table className="table table-striped">
              <thead className="font-weight-bold">
                <tr>
                  <th>{t("backup.path")}</th>
                  <th>{t("backup.time")}</th>
                  <th>{t("backup.creator")}</th>
                  <th>{t("backup.creatorPhone")}</th>
                  <th>{t("shared.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {backups.length ? (
                  backups.map((backup) => {
                    const convertedBackupDate = new Date(backup.created_at)
                      .toLocaleTimeString("fa-Persian", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        calendar: "islamic-umalqura",
                      })
                      .replace(/\//g, "-");
                    return (
                      <tr key={backup.id}>
                        <td>{backup.backupPath}</td>
                        <td>{convertedBackupDate}</td>
                        <td>
                          {backup.creator.firstName}
                          {backup.creator.lastName}
                        </td>
                        <td>
                          {backup.creator.phoneNo
                            ? backup.creator.phoneNo
                            : "-"}
                        </td>
                        <td className="table-action">
                          <Tooltip
                            target=".take-backup"
                            content={t("backup.downloadBackup")}
                            position="top"
                          />
                          <Link
                            onClick={() => takeBackupByPath(backup.backupPath)}
                            className="ms-3"
                          >
                            <FcDataBackup size={25} className="take-backup" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      <div className="empty-result">
                        <img src={backup} alt="Not Found" width={100} />
                        <p className="alert-warning text-center mt-3">
                          {t("backup.emptyBackupList")}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default BackupList;
