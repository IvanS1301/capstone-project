import { Box, Typography } from "@mui/material";

/** --- OTHER MATERIAL UI ICONS --- */
import GroupsIcon from '@mui/icons-material/Groups';
import Groups2Icon from '@mui/icons-material/Groups2';
import Groups3Icon from '@mui/icons-material/Groups3';

/** --- IMPORT CHART --- */
import Header from '../Chart/Header';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

const TeamStatistics = ({ inventory }) => {

    /** --- CALL DISPOSITION COUNTS --- */
    const teamA = inventory.teamBookedCounts ? inventory.teamBookedCounts["Team A"] || 0 : 0;
    const teamB = inventory.teamBookedCounts ? inventory.teamBookedCounts["Team B"] || 0 : 0;
    const teamC = inventory.teamBookedCounts ? inventory.teamBookedCounts["Team C"] || 0 : 0;

    /** --- HEADER SUBTITLE FORMAT --- */
    const formattedDate = moment(inventory.updatedAt).format('MMMM Do YYYY, h:mm:ss a');


    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#111827", padding: "1px 5px", borderRadius: "8px", marginBottom: "20px" }}>
                <Header title="DAILY 1K INCENTIVES" subtitle={`as of ${formattedDate}`} />
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="15px"
            >
                {/* ROW 1 */}

                <Box
                    gridColumn="span 12"
                    display="flex"
                    gap="20px"
                    backgroundColor="#212e4a"
                    p="20px"
                    borderRadius="8px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <GroupsIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{teamA}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Team A</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <Groups2Icon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{teamB}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Team B</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <Groups3Icon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{teamC}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Team C</Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default TeamStatistics;
