import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

/** --- MATERIAL UI ICONS --- */
import { HomeOutlined, PeopleOutlined, ContactsOutlined, ReceiptOutlined } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { AiOutlineMenu } from "react-icons/ai";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SettingsIcon from '@mui/icons-material/Settings';
import { Typography } from "@mui/material";

/** --- IMPORT HOOKS --- */
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogoutLG } from '../../hooks/useLogoutLG';

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const paddingStyle = isCollapsed ? "10px 15px" : "10px 25px";
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
      style={{ color: "white", padding: paddingStyle }}
    >
      {title}
    </MenuItem>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");
  const { logoutLG } = useLogoutLG();
  const { userLG } = useAuthContext();

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/":
        setSelected("Dashboard");
        break;
      case "/AdminUsers":
        setSelected("Users");
        break;
      case "/AdminLeads":
        setSelected("Leads");
        break;
      case "/AdminEmails":
        setSelected("Emails");
        break;
      case "/AdminSignup":
        setSelected("Add User");
        break;
      case `/viewprofile/${userLG._id}`:
        setSelected("Profile");
        break;
      case "/AdminBookings":
        setSelected("Recent Bookings");
        break;
      case "/AdminStaff":
        setSelected("Staff Performance");
        break;
      case "/Settings":
        setSelected("Settings");
        break;
      default:
        setSelected("");
        break;
    }
  }, [location.pathname, userLG._id]);

  const handleClick = () => {
    logoutLG();
  };

  return (
    <Sidebar
      collapsed={isCollapsed}
      width={isCollapsed ? "90px" : "290px"}
      backgroundColor="#111827"
      className="min-h-screen"
      style={{ borderRight: "none" }}
    >
      <Menu iconShape="square" className="mt-6" menuItemStyles={{
        button: ({ level, active }) => {
          if (level === 0 || level === 1) {
            return {
              backgroundColor: active ? "#0c101b" : undefined,
              color: active ? 'white' : undefined,
              "&:hover": {
                backgroundColor: "#0c101b",
              }
            }
          }
        },
      }}>
        <MenuItem className="flex items-center justify-between" style={{ backgroundColor: "transparent", cursor: "default" }}>
          <AiOutlineMenu
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-2xl text-white
                        absolute right-1 top-3 mr-5
                        cursor-pointer ${
              !isCollapsed && "rotate-180"}`}
          />

          <div className="inline-flex items-center mt-1" style={{ cursor: "default" }}>
            {!isCollapsed && (
              <img
                src={process.env.PUBLIC_URL + '/logo.png'}
                alt="logo"
                className={`image-xl
                          rounded cursor-pointer block float-left mr-2 mr-18 duration-500 ${isCollapsed && "rotate-[360deg]"}`}
              />
            )}
            {!isCollapsed && (
              <h1 className="text-white origin-left font-medium text-2xl mt-1 mr-10 duration-300">
                Chromagen
            </h1>
            )}
          </div>
        </MenuItem>

        <div className="mt-5">
          <div className="flex justify-center items-center">
            <img
              alt="profile-user"
              width="100px"
              height="100px"
              src={process.env.PUBLIC_URL + '/icon.png'}
              className="cursor-pointer rounded-full"
            />
          </div>
        </div>

        {!isCollapsed && (
          <div className="text-center">
            <h6 className="text-white font-bold mt-1 mb-0">{userLG.name}</h6>
            <h6 className="text-[#4cceac] mb-7">{userLG.role}</h6>
          </div>
        )}

        <Item
          title="Dashboard"
          to="/"
          icon={<HomeOutlined />}
          selected={selected}
          setSelected={setSelected}
        />

        {!isCollapsed && (
          <div className="text-[#a3a3a3] m-3 ml-7">
            <Typography sx={{ fontSize: '14px', m: "15px 0 5px 20px" }}>Data</Typography>
          </div>
        )}
        <Item
          title="Users"
          to="/AdminUsers"
          icon={<PeopleOutlined />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Leads"
          to="/AdminLeads"
          icon={<ContactsOutlined />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Emails"
          to="/AdminEmails"
          icon={<MarkEmailReadIcon />}
          selected={selected}
          setSelected={setSelected}
        />

        {!isCollapsed && (
          <div className="text-[#a3a3a3] m-3 ml-7">
            <Typography sx={{ fontSize: '14px', m: "15px 0 5px 20px" }}>Pages</Typography>
          </div>
        )}
        <Item
          title="Add User"
          to="/AdminSignup"
          icon={<GroupAddIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Profile"
          to={`/viewprofile/${userLG._id}`}
          icon={<AccountCircleIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Recent Bookings"
          to="/AdminBookings"
          icon={<ReceiptOutlined />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Staff Performance"
          to="/AdminStaff"
          icon={<AnalyticsIcon />}
          selected={selected}
          setSelected={setSelected}
        />

        {!isCollapsed && (
          <div className="text-[#a3a3a3] m-3 ml-7">
            <Typography sx={{ fontSize: '14px', m: "15px 0 5px 20px" }}>Settings</Typography>
          </div>
        )}
        <Item
          title="Settings"
          to="/Settings"
          icon={<SettingsIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <MenuItem
          title="Sign Out"
          icon={<ExitToAppIcon />}
          onClick={handleClick}
          style={{ color: "white", padding: "10px 25px" }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default AdminSidebar;