import { lazy, useEffect, useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";
import { GiOpenFolder } from "react-icons/gi";
import { GiFullFolder } from "react-icons/gi";
import useAxios from "../core/useAxios";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import ReceivedDocumentList from "../features/documents/components/received-documents/received-document-list";
const BarChart = lazy(() => import("./BarChart"));
const PieChart = lazy(() => import("./PieChart"));

const CommitteeCard = () => {
  const { t, i18n } = useTranslation();
  const [committeePieChartData, setCommitteePieChartData] = useState(null);
  const [committeeBarChartData, setCommitteeBarChartData] = useState(null);
  const [committeeData, ,] = useAxios({
    url: "/committee/getSentDocumentsByDepartmentByType",
  });
  useEffect(() => {
    if (committeeData) {
      const pieChartData = {
        labels: [
          t("mainLayout.dashboard.sentAhkam"),
          t("mainLayout.dashboard.receivedAhkam"),
          t("mainLayout.dashboard.sentFarman"),
          t("mainLayout.dashboard.receivedFarman"),
          t("mainLayout.dashboard.sentMusawiba"),
          t("mainLayout.dashboard.receivedMusawiba"),
          t("mainLayout.dashboard.sentHidayat"),
          t("mainLayout.dashboard.receivedHidayat"),
        ],
        datasets: [
          {
            label: t("mainLayout.dashboard.committeeData"),
            backgroundColor: [
              "rgba(54,162,235,0.4)",
              "rgba(75,192,192,0.4)",
              "rgba(255,120,201,0.4)",
              "rgba(255,206,86,0.4)",
              "rgba(153,102,255,0.4)",
              "rgba(228,141,236,0.4)",
              "rgba(107,211,100,0.4)",
              "rgba(191,197,55,0.4)",
            ],
            borderColor: [
              "rgba(54,162,235,0.3)",
              "rgba(75,192,192,0.3)",
              "rgba(255,120,201,0.3)",
              "rgba(255,206,86,0.3)",
              "rgba(153,102,255,0.3)",
              "rgba(228,141,236,0.3)",
              "rgba(107,211,100,0.3)",
              "rgba(191,197,55,0.3)",
            ],
            borderWidth: 2,
            data: [
              committeeData.countSentDocumentsByType?.HUKAM,
              committeeData.countReceivedDocumentsByType?.HUKAM,
              committeeData.countSentDocumentsByType?.FARMAN,
              committeeData.countReceivedDocumentsByType?.FARMAN,
              committeeData.countSentDocumentsByType?.MUSAWWIBA,
              committeeData.countReceivedDocumentsByType?.MUSAWWIBA,
              committeeData.countSentDocumentsByType?.HIDAYAT,
              committeeData.countReceivedDocumentsByType?.HIDAYAT,
            ],
          },
        ],
      };
      setCommitteePieChartData(pieChartData);
    }
  }, [committeeData, i18n.language]);

  useEffect(() => {
    if (committeeData) {
      const barChartData = {
        labels: [
          t("mainLayout.dashboard.inprogressSentAhkam"),
          t("mainLayout.dashboard.violationSentAhkam"),
          t("mainLayout.dashboard.doneSentAhkam"),
          t("mainLayout.dashboard.inprogressReceivedAhkam"),
          t("mainLayout.dashboard.violationReceivedAhkam"),
          t("mainLayout.dashboard.doneReceivedAhkam"),
          t("mainLayout.dashboard.inprogressSentFarman"),
          t("mainLayout.dashboard.violationSentFarman"),
          t("mainLayout.dashboard.doneSentFarman"),
          t("mainLayout.dashboard.inprogressReceivedFarman"),
          t("mainLayout.dashboard.violationReceivedFarman"),
          t("mainLayout.dashboard.doneReceivedFarman"),
          t("mainLayout.dashboard.inprogressSentMusawiba"),
          t("mainLayout.dashboard.violationSentMusawiba"),
          t("mainLayout.dashboard.doneSentMusawiba"),
          t("mainLayout.dashboard.inprogressReceivedMusawiba"),
          t("mainLayout.dashboard.violationReceivedMusawiba"),
          t("mainLayout.dashboard.doneReceivedMusawiba"),
          t("mainLayout.dashboard.inprogressSentHidayat"),
          t("mainLayout.dashboard.violationSentHidayat"),
          t("mainLayout.dashboard.doneSentHidayat"),
          t("mainLayout.dashboard.inprogressReceivedHidayat"),
          t("mainLayout.dashboard.violationReceivedHidayat"),
          t("mainLayout.dashboard.doneReceivedHidayat"),
        ],
        datasets: [
          {
            label: t("mainLayout.dashboard.committeeData"),
            backgroundColor: [
              "rgba(255,206,86,0.4)",
              "rgba(255,0,0,0.4)",
              "rgba(75,192,192,0.4)",
            ],
            borderColor: [
              "rgba(255,206,86,0.3)",
              "rgba(255,0,0,0.3)",
              "rgba(75,192,192,0.3)",
            ],
            borderWidth: 2,
            data: [
              committeeData.countSentDocumentsByTypeAndStatus?.HUKAM
                ?.IN_PROGRESS || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.HUKAM
                ?.VIOLATION || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.HUKAM?.DONE || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.HUKAM
                ?.IN_PROGRESS || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.HUKAM
                ?.VIOLATION || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.HUKAM
                ?.DONE || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.FARMAN
                ?.IN_PROGRESS || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.FARMAN
                ?.VIOLATION || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.FARMAN?.DONE ||
                0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.FARMAN
                ?.IN_PROGRESS || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.FARMAN
                ?.VIOLATION || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.FARMAN
                ?.DONE || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.MUSAWWIBA
                ?.IN_PROGRESS || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.MUSAWWIBA
                ?.VIOLATION || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.MUSAWWIBA
                ?.DONE || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.MUSAWWIBA
                ?.IN_PROGRESS || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.MUSAWWIBA
                ?.VIOLATION || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.MUSAWWIBA
                ?.DONE || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.HIDAYAT
                ?.IN_PROGRESS || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.HIDAYAT
                ?.VIOLATION || 0,
              committeeData.countSentDocumentsByTypeAndStatus?.HIDAYAT?.DONE ||
                0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.HIDAYAT
                ?.IN_PROGRESS || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.HIDAYAT
                ?.VIOLATION || 0,
              committeeData.countReceivedDocumentsByTypeAndStatus?.HIDAYAT
                ?.DONE || 0,
            ],
          },
        ],
      };
      setCommitteeBarChartData(barChartData);
    }
  }, [committeeData, i18n.language]);

  return (
    <>
      <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="col-xl-12 col-xxl-12 d-flex">
          <div className="w-100">
            <div className="row mb-2">
              <div className="col-sm-3">
                <span className="badge bg-danger">
                  {t("mainLayout.dashboard.violation")}
                </span>
                <span className="badge bg-warning">
                  {t("mainLayout.dashboard.inprogress")}
                </span>
                <span className="badge bg-success">
                  {t("mainLayout.dashboard.done")}
                </span>
                <span className="badge bg-info">
                  {t("mainLayout.dashboard.incomplete")}
                </span>
                <span className="badge bg-primary">
                  {t("mainLayout.dashboard.todo")}
                </span>
              </div>
            </div>
            <div className="">
              <div className="col-sm-3">
                {/* <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">
                          {t("mainLayout.dashboard.ahkam")}
                        </h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <FaFolderOpen />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfSent")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countSentDocumentsByType?.HUKAM || 0}
                          <IoIosArrowRoundUp className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HUKAM?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HUKAM?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HUKAM?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HUKAM?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HUKAM?.DONE || 0}
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfReceived")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countReceivedDocumentsByType?.HUKAM ||
                            0}
                          <IoIosArrowRoundDown className="text-info" />
                        </span>
                      </div>
                    </div>

                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HUKAM?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HUKAM?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HUKAM?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HUKAM?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HUKAM?.DONE || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">
                          {t("mainLayout.dashboard.faramin")}
                        </h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <FaFolderClosed />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfSent")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countSentDocumentsByType?.FARMAN || 0}
                          <IoIosArrowRoundUp className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.FARMAN?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.FARMAN?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.FARMAN?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.FARMAN?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.FARMAN?.DONE || 0}
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfReceived")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countReceivedDocumentsByType?.FARMAN ||
                            0}
                          <IoIosArrowRoundDown className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className=" mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.FARMAN?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.FARMAN?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.FARMAN?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.FARMAN?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.FARMAN?.DONE || 0}
                        </span>
                      </div>
                    </div> 
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                {/* <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">
                          {t("mainLayout.dashboard.musawibat")}
                        </h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <GiOpenFolder />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfSent")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countSentDocumentsByType?.MUSAWWIBA ||
                            0}
                          <IoIosArrowRoundUp className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.DONE || 0}
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfReceived")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countReceivedDocumentsByType
                            ?.MUSAWWIBA || 0}
                          <IoIosArrowRoundDown className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.MUSAWWIBA?.DONE || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="col-sm-3">
                {/* <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">
                          {t("mainLayout.dashboard.hidayat")}
                        </h5>
                      </div>
                      <div className="col-auto">
                        <div className="stat text-primary">
                          <GiFullFolder />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfSent")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countSentDocumentsByType?.HIDAYAT || 0}
                          <IoIosArrowRoundUp className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HIDAYAT?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HIDAYAT?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HIDAYAT?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HIDAYAT?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countSentDocumentsByTypeAndStatus
                            ?.HIDAYAT?.DONE || 0}
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="text-muted">
                          {t("mainLayout.dashboard.numOfReceived")}
                        </span>
                        <span className="mx-2">
                          {committeeData.countReceivedDocumentsByType
                            ?.HIDAYAT || 0}
                          <IoIosArrowRoundDown className="text-info" />
                        </span>
                      </div>
                    </div>
                    <div className="row mb-0">
                      <div className="col">
                        <span className="badge bg-warning mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HIDAYAT?.IN_PROGRESS || 0}
                        </span>
                        <span className="badge bg-danger mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HIDAYAT?.VIOLATION || 0}
                        </span>
                        <span className="badge bg-primary mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HIDAYAT?.TODO || 0}
                        </span>
                        <span className="badge bg-info mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HIDAYAT?.IN_COMPLETE || 0}
                        </span>
                        <span className="badge bg-success mx-2">
                          {committeeData.countReceivedDocumentsByTypeAndStatus
                            ?.HIDAYAT?.DONE || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-sm-12 col-md-4">
          <div className="card">
            <div className="card-body">
              {committeePieChartData && (
                <PieChart chartData={committeePieChartData} />
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-8">
          <div className="card">
            <div className="card-body">
              {committeeBarChartData && (
                <BarChart chartData={committeeBarChartData} />
              )}
            </div>
          </div>
        </div>
      </div> */}
   
   <ReceivedDocumentList/>
      
    </>
  );
};

export default CommitteeCard;
