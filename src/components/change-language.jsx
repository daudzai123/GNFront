import paFlag from "@assets/images/pa.png";
import faFlag from "@assets/images/fa.jpeg";
import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../contexts/app/app-context";

const ChangeLanguage = () => {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const { changeLanguage, language } = useAppContext();

  useEffect(() => {
    setShow(false);
  }, [language]);

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

  return (
    <div className="dropdown" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <a className="nav-flag dropdown-toggle" onClick={() => setShow(true)}>
        <img src={language === "fa" ? faFlag : paFlag} alt="Language" />
      </a>
      <div
        ref={ref}
        className={`dropdown-menu dropdown-menu-end ${
          show ? "show" : undefined
        }`}
      >
        <a
          className="dropdown-item fw-bolder d-flex align-items-center gap-2"
          style={{
            textAlign:
              language === "fa" || language === "pa" ? "right" : "left",
          }}
          onClick={() => changeLanguage("fa")}
        >
          <img src={faFlag} width="20" />
          <span className="align-middle">دری</span>
        </a>
        <a
          className="dropdown-item fw-bolder d-flex align-items-center gap-2"
          style={{
            textAlign:
              language === "fa" || language === "pa" ? "right" : "left",
          }}
          onClick={() => changeLanguage("pa")}
        >
          <img src={paFlag} width="20" />
          <span className="align-middle">پشتو</span>
        </a>
      </div>
    </div>
  );
};

export default ChangeLanguage;
