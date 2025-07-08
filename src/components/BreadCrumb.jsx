import { Link } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";

const PrimeReactBreadCrumb = ({ first, firstUrl, second, secondUrl, last }) => {
  const iconItemTemplate = (item, options) => {
    return (
      <Link to={item.url} className={options.className}>
        <span>{item.label}</span>
      </Link>
    );
  };
  const items = [
    { label: first, url: firstUrl, template: iconItemTemplate },
    ...(second
      ? [{ label: second, url: secondUrl, template: iconItemTemplate }]
      : []),
    { label: last },
  ];

  const home = { icon: "pi pi-home", url: "/" };

  return (
    <div>
      <BreadCrumb model={items} home={home} />
    </div>
  );
};

export default PrimeReactBreadCrumb;
