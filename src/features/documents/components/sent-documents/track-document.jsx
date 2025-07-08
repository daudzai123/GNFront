import React, { useState, useEffect } from "react";
import { Tree } from "primereact/tree";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import { useTranslation } from "react-i18next";

const TrackDocument = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [nodes, setNodes] = useState([]);
  const httpInterceptedService = useHttpInterceptedService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpInterceptedService.get(
          `/sendDocument/byDocId/${id}`
        );
        const fetchedData = response.data;

        const treeMap = {};
        const rootNodes = [];
        fetchedData.forEach((item) => {
          if (item.parent_SendDoc_Id) {
            if (!treeMap[item.parent_SendDoc_Id]) {
              treeMap[item.parent_SendDoc_Id] = [];
            }
            treeMap[item.parent_SendDoc_Id].push(item);
          } else {
            rootNodes.push(item);
          }
        });

        const buildTree = (node) => {
          const children = treeMap[node.sendDocId] || [];
          const convertedSendingDate = new Date(node.sendingDate)
            .toLocaleTimeString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-");
          return {
            label: (
              <div>
                <span className="text-primary">{t("shared.subject")}:</span>
                <span className="mx-2">{node.subject}</span>
                <br />
                <span className="text-muted">{t("shared.sender")}:</span>
                <span className="mx-2">{node.senderDepartment.depName}</span>
                <br />
                <span className="text-muted">{t("shared.receiver")}:</span>
                <span className="mx-2">{node.receiverDepartments.depName}</span>
                <br />
                <span className="text-muted">{t("shared.sendingStatus")}:</span>
                <span
                  className={`mx-2 ${
                    node.sendingStatus === "PENDING"
                      ? "badge bg-warning"
                      : "badge bg-success"
                  }`}
                >
                  {node.sendingStatus === "PENDING"
                    ? t("shared.pending")
                    : t("shared.seen")}
                </span>
                <br />
                <span className="text-muted">{t("shared.secrecy")}:</span>
                <span
                  className={`mx-2 ${
                    node.secret === "SECRET"
                      ? "badge bg-danger"
                      : "badge bg-primary"
                  }`}
                >
                  {node.secret === "SECRET"
                    ? t("shared.secret")
                    : t("shared.nonSecret")}
                </span>
                <br />
                <span className="text-muted">{t("shared.sendingDate")}:</span>
                <span className="mx-2">{convertedSendingDate}</span>
              </div>
            ),
            key: node.sendDocId.toString(),
            icon: <HiOutlineClipboardDocumentList />,
            children: children.map((child) => buildTree(child)),
            style: { marginRight: "1rem" },
          };
        };

        const transformedData = rootNodes.map((node) => buildTree(node));
        setNodes(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-card p-mb-4 p-d-flex p-jc-center">
      <Tree
        value={nodes}
        className="w-full md:w-30rem"
        emptyMessage={t("shared.notFound")}
      />
    </div>
  );
};

export default TrackDocument;
