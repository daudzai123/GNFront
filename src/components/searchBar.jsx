import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsSearch } from "react-icons/bs";
const SearchBar = ({ searchItems }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    searchItems(value);
    setValue("");
  };

  return (
    <form onSubmit={onSubmit} className="search d-flex align-items-center w-80">
      <div className="input-group">
        <input
          className="form-control form-control-lg rounded-end pe-5 border-info"
          type="text"
          pattern="^[a-zA-Z0-9\u0600-\u06FF\s]+$"
          placeholder={t("filter.search")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <BsSearch className="position-absolute top-50 translate-middle-y text-muted me-3" />
      </div>
    </form>
  );
};

export default SearchBar;
