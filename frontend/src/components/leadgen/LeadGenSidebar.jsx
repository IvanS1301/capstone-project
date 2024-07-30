import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

/** --- MATERIAL UI ICONS --- */
import { HomeOutlined, ContactsOutlined } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AiOutlineMenu } from "react-icons/ai";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Typography } from "@mui/material";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

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

const LeadGenSidebar = () => {
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
            case "/LeadGenLeads":
                setSelected("Leads");
                break;
            case "/LeadGenAdd":
                setSelected("Add New Lead");
                break;
            case "/LeadGenTime":
                setSelected("Status Logs");
                break;
            case `/viewuser/${userLG._id}`:
                setSelected("Personal Info");
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
                    <div
                      className="w-24 h-24 rounded-full overflow-hidden"
                      style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                    >
                      <img
                        alt="profile-user"
                        src={userLG.profileImage || process.env.PUBLIC_URL + '/icon.png'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
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
                        <Typography sx={{ fontSize: '14px', m: "15px 0 5px 20px" }}>Lead</Typography>
                    </div>
                )}
                <Item
                    title="Leads"
                    to="/LeadGenLeads"
                    icon={<ContactsOutlined />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Add New Lead"
                    to="/LeadGenAdd"
                    icon={<PostAddIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                {!isCollapsed && (
                    <div className="text-[#a3a3a3] m-3 ml-7">
                        <Typography sx={{ fontSize: '14px', m: "15px 0 5px 20px" }}>Profile</Typography>
                    </div>
                )}
                <Item
                    title="Personal Info"
                    to={`/viewuser/${userLG._id}`}
                    icon={<AccountCircleIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Status Logs"
                    to="/LeadGenTime"
                    icon={<PermContactCalendarIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                {!isCollapsed && (
                    <div className="text-[#a3a3a3] m-3 ml-7">
                        <Typography sx={{ fontSize: '14px', m: "15px 0 5px 20px" }}>Settings</Typography>
                    </div>
                )}
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

export default LeadGenSidebar;
