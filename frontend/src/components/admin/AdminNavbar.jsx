import { useState, useEffect } from "react";
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, IconButton, Badge, Menu, MenuItem } from "@mui/material";

/** --- MATERIAL UI ICONS --- */
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const AdminNavbar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${URL}/api/notifications`);
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchNotifications();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query); // Call the onSearch function passed from AdminLeads
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch(`${URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor="#111827"
                borderRadius="20px"
                sx={{ width: "60%", maxWidth: "350px" }}
            >
                <InputBase
                    sx={{ ml: 2, flex: 1, color: "#e0e0e0" }}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon sx={{ color: "#e0e0e0" }} />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton sx={{ color: "#111827" }} onClick={handleNotificationClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsOutlinedIcon />
                    </Badge>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleNotificationClose}
                >
                    {notifications.map((notification) => (
                        <MenuItem
                            key={notification._id}
                            onClick={() => handleMarkAsRead(notification._id)}
                            sx={{ backgroundColor: notification.isRead ? 'inherit' : '#f0f0f0' }}
                        >
                            {notification.message}
                        </MenuItem>
                    ))}
                </Menu>
                <IconButton sx={{ color: "#111827" }}>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton sx={{ color: "#111827" }}>
                    <PersonOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AdminNavbar;
