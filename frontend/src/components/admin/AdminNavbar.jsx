import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";

/** --- MATERIAL UI --- */
import { Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

const AdminNavbar = ({ onSearch }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        onSearch(query); // Call the onSearch function passed from AdminLeads
    };

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor="#111827"
                borderRadius="3px"
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
                <IconButton onClick={colorMode.toggleColorMode} sx={{ color: "#111827" }}>
                    {theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                            <LightModeOutlinedIcon />
                        )}
                </IconButton>
                <IconButton sx={{ color: "#111827" }}>
                    <NotificationsOutlinedIcon />
                </IconButton>
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