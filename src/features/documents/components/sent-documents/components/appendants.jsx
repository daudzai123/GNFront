import pdfIcon from "@assets/images/pdf.jpeg";
import excelIcon from "@assets/images/excel.jpeg";
import wordIcon from "@assets/images/word.jpeg";
import textIcon from "@assets/images/text.jpeg";
import unknownIcon from "@assets/images/unknown.jpeg";
import { Link } from "react-router-dom";

const Appendants = ({ data }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // View document file
  const getDocument = (url) => {
    window.open(url, "_blank");
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <div className="card-body d-flex flex-row">
        {data?.documentId?.appendantDocsList.map((append) => {
          const fileExtension = getFileExtension(append.appendantDocName);
          return (
            <div
              key={append.appendantDocId}
              className="mx-3 d-flex flex-column justify-content-center align-items-center"
              style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}
            >
              {fileExtension === "jpg" ||
              fileExtension === "jpeg" ||
              fileExtension === "png" ? (
                <>
                  <img
                    src={`${BASE_URL}${append.appendantDocDownloadUrl}`}
                    alt={append.appendantDocName}
                    height={80}
                    width={80}
                  />
                  <Link
                    onClick={() =>
                      getDocument(
                        `${BASE_URL}${append.appendantDocDownloadUrl}`
                      )
                    }
                  >
                    {append.appendantDocName}
                  </Link>
                </>
              ) : fileExtension === "pdf" ? (
                <>
                  <img src={pdfIcon} alt="PDF" height={80} width={80} />
                  <Link
                    onClick={() =>
                      getDocument(
                        `${BASE_URL}${append.appendantDocDownloadUrl}`
                      )
                    }
                  >
                    {append.appendantDocName}
                  </Link>
                </>
              ) : fileExtension === "xlsx" || fileExtension === "xls" ? (
                <>
                  <img src={excelIcon} alt="Excel" height={80} width={80} />
                  <Link
                    onClick={() =>
                      getDocument(
                        `${BASE_URL}${append.appendantDocDownloadUrl}`
                      )
                    }
                  >
                    {append.appendantDocName}
                  </Link>
                </>
              ) : fileExtension === "doc" || fileExtension === "docx" ? (
                <>
                  <img src={wordIcon} alt="Word" height={80} width={80} />
                  <Link
                    onClick={() =>
                      getDocument(
                        `${BASE_URL}${append.appendantDocDownloadUrl}`
                      )
                    }
                  >
                    {append.appendantDocName}
                  </Link>
                </>
              ) : fileExtension === "txt" ? (
                <>
                  <img src={textIcon} alt="Text" height={80} width={80} />
                  <Link
                    onClick={() =>
                      getDocument(
                        `${BASE_URL}${append.appendantDocDownloadUrl}`
                      )
                    }
                  >
                    {append.appendantDocName}
                  </Link>
                </>
              ) : (
                <>
                  <img
                    src={unknownIcon}
                    alt="Text Icon"
                    height={80}
                    width={80}
                  />
                  <Link
                    onClick={() =>
                      getDocument(
                        `${BASE_URL}${append.appendantDocDownloadUrl}`
                      )
                    }
                  >
                    {append.appendantDocName}
                  </Link>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Appendants;
