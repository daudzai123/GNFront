import React, { useState, useEffect } from "react";
import { Tree } from "primereact/tree";
import { FaBuilding } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";

const DepartmentChart = () => {
  const { t } = useTranslation();
  const [departmentData, setDepartmentData] = useState(null);
  const httpInterceptedService = useHttpInterceptedService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await httpInterceptedService.get(
          "/department/allForChart"
        );
        const fetchedData = response.data;

        const topLevelDepartments = fetchedData.filter(
          (department) => department.parent === null
        );

        const transformDataRecursive = (department) => {
          const children = fetchedData
            .filter(
              (child) => child.parent && child.parent.depId === department.depId
            )
            .map(transformDataRecursive);

          return {
            key: department.depId,
            label: (
              <div>
                <FaBuilding />
                <span className="me-2">{department.depName}</span>
              </div>
            ),
            children: children.length ? children : null,
            style: { marginRight: "1rem" },
          };
        };

        const transformedData = topLevelDepartments.map(transformDataRecursive);
        setDepartmentData(transformedData);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="card" style={{ overflowX: "auto" , fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        <div className="card-header" style={{background:'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%)'}}>
          <h2>{t("department.orgChart")}</h2>
        </div>
        <div className="card-body">
          {departmentData ? (
            <Tree value={departmentData} className="w-full md:w-30rem" />
          ) : (
            <p className="text-info">{t("shared.informationLoading")}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DepartmentChart;
