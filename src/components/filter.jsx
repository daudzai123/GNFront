import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import useAuth from "../features/hooks/use-auth";
import { MultiSelect } from "primereact/multiselect";
import { useTranslation } from "react-i18next";

const Filter = ({
  filters,
  onFilterChange,
  onFilterSubmit,
  resetFilter,
  isSentDocument,
}) => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [departmentData, setDepartmentData] = useState([]);
  const [isFilterSelected, setIsFilterSelected] = useState(false);

  useEffect(() => {
    if (auth && auth.departments) {
      const mappedDepartments = auth.departments.map((dep) => ({
        label: dep.depName,
        value: dep.depId.toString(),
      }));
      setDepartmentData(mappedDepartments);
    }
  }, [auth]);

  useEffect(() => {
    const anyFilterSelected = Object.values(filters).some((filter) =>
      Array.isArray(filter) ? filter.length > 0 : filter
    );
    setIsFilterSelected(anyFilterSelected);
  }, [filters]);

  const departmentIdsKey = isSentDocument
    ? "senderDepartmentIds"
    : "receiverDepartmentIds";

  return (
    <div className="row" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3>
              {isSentDocument
                ? t("filter.sentDocFilter")
                : t("filter.receivedDocFilter")}
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={onFilterSubmit}>
              <div className="row">
                <div className="col-sm-10 col-md-6 col-lg-8 mb-3 d-table h-100">
                  <div className="input-group">
                    <input
                      className="form-control form-control-lg rounded-end pe-5 border-info"
                      type="text"
                      pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                      placeholder={t("filter.search")}
                      value={filters.searchTerm}
                      onChange={(e) =>
                        onFilterChange("searchTerm", e.target.value)
                      }
                    />
                    <BsSearch className="position-absolute top-50 translate-middle-y text-muted me-3" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <input
                    type="text"
                    pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                    className="form-control form-control-lg"
                    placeholder={t("shared.docNum")}
                    value={filters.documentNo}
                    onChange={(e) =>
                      onFilterChange("documentNo", e.target.value)
                    }
                  />
                </div>
                {/* <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <input
                    type="text"
                    pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                    className="form-control form-control-lg"
                    placeholder={t("shared.docNumLeader")}
                    value={filters.documentNo2}
                    onChange={(e) =>
                      onFilterChange("documentNo2", e.target.value)
                    }
                  />
                </div> */}
                <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <input
                    type="text"
                    pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                    className="form-control form-control-lg"
                    placeholder={t("shared.subject")}
                    value={filters.subject}
                    onChange={(e) => onFilterChange("subject", e.target.value)}
                  />
                </div>
                <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <select
                    className="form-select form-select-lg"
                    value={filters.documentType}
                    onChange={(e) =>
                      onFilterChange("documentType", e.target.value)
                    }
                  >
                    <option value="">{t("filter.chooseDocType")}</option>
                    {/* <option value="MAKTOOB">{t("filter.maktoob")}</option> */}
                    <option value="FARMAN">{t("filter.farman")}</option>
                    {/* <option value="MUSAWWIBA">{t("filter.musawiba")}</option>
                    <option value="HIDAYAT">{t("filter.hidayat")}</option>
                    <option value="HUKAM">{t("filter.hukam")}</option> */}
                    <option value="REPORT">{t("filter.report")}</option>
                  </select>
                </div>
                <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <select
                    className="form-select form-select-lg"
                    value={filters.documentStatus}
                    onChange={(e) =>
                      onFilterChange("documentStatus", e.target.value)
                    }
                  >
                    <option value="">{t("filter.chooseDocStatus")}</option>
                    <option value="TODO">
                      {t("mainLayout.dashboard.todo")}
                    </option>
                    <option value="IN_PROGRESS">
                      {t("mainLayout.dashboard.inprogress")}
                    </option>
                    <option value="DONE">
                      {t("mainLayout.dashboard.done")}
                    </option>
                    <option value="IN_COMPLETE">
                      {t("mainLayout.dashboard.incomplete")}
                    </option>
                    <option value="VIOLATION">
                      {t("mainLayout.dashboard.violation")}
                    </option>
                  </select>
                </div>
                {/* <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <MultiSelect
                    placeholder={
                      isSentDocument
                        ? t("filter.chooseSender")
                        : t("filter.chooseReceiver")
                    }
                    value={filters[departmentIdsKey] || []}
                    options={departmentData}
                    onChange={(e) => onFilterChange(departmentIdsKey, e.value)}
                    filter={true}
                    filterPlaceholder={t("filter.search")}
                    style={{ width: "100%" }}
                  />
                </div> */}
                {/* <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <select
                    className="form-select form-select-lg"
                    value={filters.referenceType}
                    onChange={(e) =>
                      onFilterChange("referenceType", e.target.value)
                    }
                  >
                    <option value={""}>{t("filter.chooseReference")}</option>
                    <option value="AMIR">{t("filter.leader")}</option>
                    <option value="RAYESULWOZARA">
                      {t("filter.rayesulwozara")}
                    </option>
                    <option value="KABINA">{t("filter.kabina")}</option>{" "}
                    <option value="FINANACE_KABINA">
                      {t("filter.economicKabina")}
                    </option>
                  </select>
                </div> */}
                <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <DatePicker
                    value={
                      filters.sendingDateStart
                        ? new Date(filters.sendingDateStart)
                        : ""
                    }
                    placeholder={t("filter.startDate")}
                    onChange={(startDate) =>
                      onFilterChange(
                        "sendingDateStart",
                        new DateObject(startDate)
                          .convert(gregorian, gregorian_en)
                          .format("YYYY-MM-DD")
                      )
                    }
                    format="YYYY/MM/DD"
                    calendar={arabic}
                    locale={arabic_fa}
                    containerClassName="custom-container"
                    inputClass="form-control form-control-lg"
                  />
                </div>
                <div className="col-sm-10 col-md-4 col-lg-4 mx-auto mb-3 d-table h-100">
                  <DatePicker
                    value={
                      filters.sendingDateEnd
                        ? new Date(filters.sendingDateEnd)
                        : ""
                    }
                    placeholder={t("filter.endDate")}
                    onChange={(endDate) =>
                      onFilterChange(
                        "sendingDateEnd",
                        new DateObject(endDate)
                          .convert(gregorian, gregorian_en)
                          .format("YYYY-MM-DD")
                      )
                    }
                    format="YYYY/MM/DD"
                    calendar={arabic}
                    locale={arabic_fa}
                    containerClassName="custom-container"
                    inputClass="form-control form-control-lg"
                  />
                </div>
                <div className="col d-flex justify-content-end">
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-lg btn-outline-secondary mx-2"
                      disabled={!isFilterSelected}
                      onClick={resetFilter}
                    >
                      {t("filter.cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                      disabled={!isFilterSelected}
                    >
                      {t("filter.doFilter")}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
