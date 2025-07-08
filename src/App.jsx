import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./core/i18n";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import './index.css'
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer rtl />
    </>
  );
}

export default App;
