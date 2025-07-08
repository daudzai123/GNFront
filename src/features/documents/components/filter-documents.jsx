import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import useHttpInterceptedService from "../../hooks/use-httpInterceptedService";
import { useTranslation } from "react-i18next";
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { BsSearch } from "react-icons/bs";

const FilterDocuments = ({
  filters,
  onFilterChange,
  onFilterSubmit,
  getReferenceData,
  resetFilter,
}) => {
  const { t } = useTranslation();
  const httpInterceptedService = useHttpInterceptedService();
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [referenceOptions, setReferenceOptions] = useState([]);

  useEffect(() => {
    const getReferences = async () => {
      try {
        const response = await httpInterceptedService.get(
          "/reference/allwithoutpage"
        );

        if (response.data) {
          const options = response.data.map((ref) => ({
            value: ref.id,
            label: ref.refName,
          }));
          setReferenceOptions(options);
          getReferenceData(options);
        } else {
          console.error("Error fetching data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    getReferences();
  }, []);

  useEffect(() => {
    const anyFilterSelected = Object.values(filters).some((filter) =>
      Array.isArray(filter) ? filter.length > 0 : filter
    );
    setIsFilterSelected(anyFilterSelected);
  }, [filters]);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3>{t("filter.docFilter")}</h3>
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
                <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <input
                    type="text"
                    pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                    className="form-control form-control-lg"
                    placeholder={t("shared.docNum")}
                    value={filters.docNumber}
                    onChange={(e) =>
                      onFilterChange("docNumber", e.target.value)
                    }
                  />
                </div>
                {/* <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <input
                    type="text"
                    pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                    className="form-control form-control-lg"
                    placeholder={t("shared.docNumLeader")}
                    value={filters.docNumber2}
                    onChange={(e) =>
                      onFilterChange("docNumber2", e.target.value)
                    }
                  />
                </div> */}
                <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <input
                    type="text"
                    pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
                    className="form-control form-control-lg"
                    placeholder={t("shared.subject")}
                    value={filters.subject}
                    onChange={(e) => onFilterChange("subject", e.target.value)}
                  />
                </div>
                <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <select
                    className="form-select form-select-lg"
                    value={filters.docType}
                    onChange={(e) => onFilterChange("docType", e.target.value)}
                  >
                    <option value="">{t("filter.chooseDocType")}</option>
                    <option value="FARMAN">{t("filter.farman")}</option>
                    <option value="REPORT">{t("filter.report")}</option>
                  </select>
                </div>
                {/* <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <Dropdown
                    optionLabel="label"
                    optionValue="value"
                    value={filters.referenceId}
                    onChange={(e) => onFilterChange("referenceId", e.value)}
                    options={referenceOptions}
                    filter
                    placeholder={t("filter.chooseReferenceImpl")}
                    className="w-full md:w-14rem"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
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
                    <option value="KABINA">{t("filter.kabina")}</option>
                    <option value="FINANACE_KABINA">
                      {t("filter.economicKabina")}
                    </option>
                  </select>
                </div> */}
                <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <DatePicker
                    value={
                      filters.documentCreationStartDate
                        ? new Date(filters.documentCreationStartDate)
                        : ""
                    }
                    placeholder={t("filter.startDate")}
                    onChange={(startDate) =>
                      onFilterChange(
                        "documentCreationStartDate",
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
                <div className="col-sm-10 col-md-3 col-lg-3 mx-auto mb-3 d-table h-100">
                  <DatePicker
                    value={
                      filters.documentCreationEndDate
                        ? new Date(filters.documentCreationEndDate)
                        : ""
                    }
                    placeholder={t("filter.endDate")}
                    onChange={(endDate) =>
                      onFilterChange(
                        "documentCreationEndDate",
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
                <div className="col d-flex justify-content-end mb-3">
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDocuments;
