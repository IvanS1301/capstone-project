import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, IconButton, Badge, Menu, MenuItem, Typography, Avatar, Divider, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

/** --- MATERIAL UI ICONS --- */
import InputBase from "@mui/material/InputBase";
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SearchIcon from "@mui/icons-material/Search";

/** --- IMPORT HOOKS --- */
import { useAuthContext } from '../../hooks/useAuthContext';

const AdminNavbar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [filter, setFilter] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const { userLG } = useAuthContext();

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
        onSearch(query);
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (notification) => {
        try {
            const response = await fetch(`${URL}/api/notifications/${notification._id}/read`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setNotifications(notifications.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
                setSelectedNotification(notification);
                setOpenDialog(true);
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedNotification(null);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filteredNotifications = filter === "all" ? notifications : notifications.filter(n => !n.isRead);

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box
                display="flex"
                backgroundColor="#111827"
                borderRadius="25px"
                sx={{ width: "60%", maxWidth: "400px", p: "6px" }}
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

            <Box display="flex">
                <IconButton
                    sx={{
                        color: "#111827",
                        fontSize: 35, // Adjust the icon size
                        '& .MuiBadge-dot': {
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                        },
                    }}
                    onClick={handleNotificationClick}
                >
                    <Badge
                        badgeContent={unreadCount}
                        color="error"
                        sx={{
                            '.MuiBadge-dot': {
                                width: 14, // Adjust the size of the badge
                                height: 14,
                            },
                        }}
                    >
                        <NotificationsRoundedIcon
                            sx={{
                                fontSize: 'inherit', // Ensure the icon inherits the size from IconButton
                            }}
                        />
                    </Badge>
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleNotificationClose}
                    PaperProps={{
                        style: {
                            width: '550px',
                            maxHeight: '950px',
                            backgroundColor: '#212e4a',
                            borderRadius: "20px"
                        },
                    }}
                >
                    <Box p={2} backgroundColor="#212e4a">
                        <Typography variant="h6" gutterBottom sx={{ fontSize: '30px', fontWeight: 'bold', color: '#e0e0e0', ml: "5px" }}>
                            Notifications
                        </Typography>
                        <Box display="flex" justifyContent="center" mb={3}>
                            <Button
                                variant={filter === 'all' ? 'contained' : 'outlined'}
                                onClick={() => setFilter('all')}
                                sx={{
                                    textTransform: 'none',
                                    backgroundColor: filter === 'all' ? '#3b5998' : 'transparent',
                                    color: filter === 'all' ? '#fff' : '#3b5998',
                                    borderColor: '#3b5998',
                                    mr: 1,
                                    '&:hover': {
                                        backgroundColor: filter === 'all' ? '#3b5998' : '#f0f0f0',
                                        borderColor: '#3b5998'
                                    }
                                }}
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === 'unread' ? 'contained' : 'outlined'}
                                onClick={() => setFilter('unread')}
                                sx={{
                                    textTransform: 'none',
                                    backgroundColor: filter === 'unread' ? '#3b5998' : 'transparent',
                                    color: filter === 'unread' ? '#fff' : '#3b5998',
                                    borderColor: '#3b5998',
                                    '&:hover': {
                                        backgroundColor: filter === 'unread' ? '#3b5998' : '#f0f0f0',
                                        borderColor: '#3b5998'
                                    }
                                }}
                            >
                                Unread
                            </Button>
                        </Box>
                        <Divider sx={{ mt: 2, mb: 2, bgcolor: "#e0e0e0" }} />
                        {filteredNotifications.map((notification) => (
                            <MenuItem
                                key={notification._id}
                                onClick={() => handleMarkAsRead(notification)}
                                sx={{
                                    display: 'block',
                                    whiteSpace: 'normal',
                                    mb: 1
                                }}
                            >
                                <Paper sx={{ p: 2, width: '100%', backgroundColor: '#041926', }} elevation={notification.isRead ? 1 : 4}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar sx={{ bgcolor: '#3e4396', mr: 2 }}>{notification.message.charAt(0)}</Avatar>
                                        <Box>
                                            <Typography variant="body1" sx={{ color: '#94e2cd', fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="#e0e0e0">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mt: 1, mb: 1, bgcolor: "#e0e0e0" }} />
                                    <Typography variant="caption" color="#e0e0e0" sx={{ display: 'block', textAlign: 'right' }}>
                                        {notification.isRead ? 'Read' : 'Unread'}
                                    </Typography>
                                </Paper>
                            </MenuItem>
                        ))}
                    </Box>
                </Menu>

                <IconButton
                    sx={{
                        color: "#111827",
                        fontSize: 35, // Adjust the icon size
                        '& .MuiBadge-dot': {
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                        },
                    }}
                    onClick={handleProfileMenuOpen}
                >
                    <AccountCircleRoundedIcon
                        sx={{
                            fontSize: 'inherit', // Ensure the icon inherits the size from IconButton
                        }}
                    />
                </IconButton>

                <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                >
                    <MenuItem>
                        <Typography>
                            <Link to={`/viewprofile/${userLG._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                Update Status
                            </Link>
                        </Typography>
                    </MenuItem>
                </Menu>
            </Box>

            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" className="bounce-in-modal">
                <DialogTitle sx={{ fontSize: '30px', fontWeight: 'bold' }}>Notification Details:</DialogTitle>
                <DialogContent>
                    {selectedNotification && (
                        <Paper sx={{ p: 3, width: '100%', backgroundColor: '#041926' }} elevation={selectedNotification.isRead ? 1 : 4}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: '#3e4396', mr: 3 }}>{selectedNotification.message.charAt(0)}</Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#94e2cd', fontWeight: selectedNotification.isRead ? 'normal' : 'bold' }}>
                                        {selectedNotification.message}
                                    </Typography>
                                    <Typography variant="body2" color="#e0e0e0">
                                        {new Date(selectedNotification.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mt: 2, mb: 2, bgcolor: "#e0e0e0" }} />
                            <Typography variant="body2" color="#e0e0e0" sx={{ display: 'block', textAlign: 'right' }}>
                                {selectedNotification.isRead ? 'Read' : 'Unread'}
                            </Typography>
                        </Paper>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminNavbar;
