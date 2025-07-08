import { useEffect, useRef, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../features/hooks/use-auth";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../features/hooks/use-httpInterceptedService";
const Notification = () => {
  const { t } = useTranslation();
  const [notificationData, setNotificationData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [show, setShow] = useState(false);
  const { auth } = useAuth();
  const ref = useRef();
  const httpInterceptedService = useHttpInterceptedService();

  useEffect(() => {
    const checkIfclickOutside = (e) => {
      if (show && ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", checkIfclickOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfclickOutside);
    };
  }, [show]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpInterceptedService.get(
          "/notification/allOfUser"
        );
        if (response) {
          setNotificationData(response.data);
          setTotalCount(response.data.length);
        }
      } catch (error) {
        console.error("Error message:", error);
      }
    };
    fetchData();
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await httpInterceptedService.get(
        `/notification/markAsRead/${notificationId}`
      );
      setShow(false);
      setNotificationData((prevData) =>
        prevData.filter((notification) => notification.id !== notificationId)
      );
      setTotalCount(totalCount - 1);
    } catch (error) {
      console.error("Error see notification:", error);
    }
  };

  const markAllNotificationsAsRead = async (userId) => {
    try {
      await httpInterceptedService.get(`/notification/markAllAsRead/${userId}`);
      setNotificationData([]);
      setTotalCount(0);
      setShow(false);
    } catch (error) {
      console.error("Error during mark all notification as read:", error);
    }
  };

  const notificationClassName = window.matchMedia("(max-width: 768px)").matches
    ? "mobile-size"
    : "";

  return (
    <>
      <div className="dropdown">
        <a
          className="nav-flag dropdown-toggle"
          onClick={() => setShow(true)}
          style={{ textDecoration: "none" }}
        >
          <div className="position-relative">
            <FaRegBell />
            {totalCount > 0 && (
              <div className="noti-count mx-3">{totalCount}</div>
            )}
          </div>
        </a>
        <div
          ref={ref}
          className={`dropdown-menu dropdown-menu-start ${notificationClassName} ${
            show ? "show" : undefined
          }`}
          style={{ right: "auto", left: 0 }}
        >
          <ul className="px-2">
            {notificationData.map((notification) => {
              const convertedDate = new Date(notification.created_at)
                .toLocaleTimeString("fa-Persian", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  calendar: "islamic-umalqura",
                })
                .replace(/\//g, "-");
              return (
                <Link
                  to={notification.content.link}
                  className="dropdown-item notification-item"
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-title">
                      <div className="col">
                        {notification.notificationType === "Comment"
                          ? t("notification.comment")
                          : notification.notificationType === "SendDoc"
                          ? t("notification.document")
                          : notification.notificationType === "Users"
                          ? t("notification.user")
                          : notification.notificationType === "Doc_Update"
                          ? t("notification.docUpdate")
                          : notification.notificationType}
                      </div>
                      <div className="col">{convertedDate}</div>
                    </div>
                    <div
                      className="notification-details"
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {notification.content.message}
                    </div>
                  </div>
                </Link>
              );
            })}
          </ul>
          {totalCount > 1 && (
            <Link
              className="ms-2"
              onClick={() => markAllNotificationsAsRead(auth?.id)}
            >
              {t("notification.markAsRead")}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;
