import { Link, useSearchParams } from "react-router-dom";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

const Pagination = ({
  totalRecords,
  maxPagesToShow = import.meta.env.VITE_MAX_PAGE_SHOW,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = +searchParams.get("page") || 0;
  const size = +searchParams.get("size") || import.meta.env.VITE_PAGE_SIZE;
  const pages = Math.ceil(totalRecords / size);

  const prevPage = () => {
    if (currentPage > 0) {
      setSearchParams({ page: currentPage - 1, size: size });
    }
  };

  const nextPage = () => {
    if (currentPage < pages - 1) {
      setSearchParams({ page: currentPage + 1, size: size });
    }
  };

  const handlePageSizeChange = (e) => {
    setSearchParams({ page: 0, size: e.target.value });
  };

  if (totalRecords === 0) {
    return null;
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 0; i < pages; i++) {
      if (
        i === 0 ||
        i === pages - 1 ||
        (i >= currentPage - maxPagesToShow / 2 &&
          i <= currentPage + maxPagesToShow / 2)
      ) {
        pageNumbers.push(
          <li
            key={`page${i}`}
            onClick={() => {
              setSearchParams({ page: i, size: size });
            }}
            className={`page-item ${i === currentPage ? "active" : ""}`}
          >
            <Link className="page-link">{i + 1}</Link>
          </li>
        );
      } else if (
        (i === currentPage - maxPagesToShow / 2 - 1 &&
          currentPage - maxPagesToShow / 2 > 1) ||
        (i === currentPage + maxPagesToShow / 2 + 1 &&
          currentPage + maxPagesToShow / 2 < pages - 2)
      ) {
        pageNumbers.push(
          <li key={`page${i}`} className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <nav>
      <ul className="pagination pagination-lg" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
        {currentPage !== 0 && (
          <li className="page-item" onClick={prevPage}>
            <Link className="page-link">
              <GrFormNext />
            </Link>
          </li>
        )}
        {renderPageNumbers()}
        {currentPage !== pages - 1 && (
          <li className="page-item" onClick={nextPage}>
            <Link className="page-link">
              <GrFormPrevious />
            </Link>
          </li>
        )}
        <li>
          <select
            value={size}
            onChange={handlePageSizeChange}
            className="form-select mx-3 my-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
