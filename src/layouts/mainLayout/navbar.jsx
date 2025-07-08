import ChangeLanguage from "../../components/change-language";
import Notification from "../../components/notification";
import UserProfile from "../../components/user-profile";
import { useAppContext } from "../../contexts/app/app-context";

const Navbar = () => {
  const { toggleSidebar } = useAppContext();
  return (
    <nav className="navbar navbar-bg" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }} >
      <a className="sidebar-toggle" onClick={toggleSidebar}>
        <i className="hamburger align-self-center"></i>
      </a>
      <div className="d-flex align-items-center">
        <Notification />
        <ChangeLanguage />
        <UserProfile />
      </div>
    </nav>
  );
};

export default Navbar;
