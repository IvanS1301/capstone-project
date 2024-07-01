/** --- MATERIAL UI --- */
import { Box, Typography } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import BeenhereIcon from '@mui/icons-material/Beenhere';

/** --- IMPORT CHART --- */
import Header from '../Chart/Header';

const AgentAnalyticsTabs = ({ bookedUnits }) => {
    if (!bookedUnits) {
        return <Typography variant="h6" color="error">No data available</Typography>;
    }

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#111827", padding: "1px 5px", borderRadius: "8px", marginBottom: "50px" }}>
                <Header title="Booked Summary" subtitle="Statistics for Today" />
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
                marginTop="40px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 12"
                    display="flex"
                    gap="20px"
                    backgroundColor="#212e4a"
                    p="20px"
                    borderRadius="18px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentTurnedInIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.assignedDaily || 0}</Typography>
                            <Typography variant="body1" color="#e0e0e0">New Assigned Leads</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <BookIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.bookedDaily || 0}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Booked Daily</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <CollectionsBookmarkIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.bookedMonth || 0}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Booked Month-to-Date</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <BeenhereIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.totalBooked || 0}</Typography>
                            <Typography variant="body1" color="#e0e0e0">All Time</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ROW 3 */}
                <Box
                    gridColumn="span 6"
                    gridRow="span 4"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="3px"
                    marginTop="20px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="18px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="93%" // Ensure it takes the full height of the parent container
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid #1F2A40`}
                            colors="#e0e0e0"
                            p="15px"
                            backgroundColor="#192231"
                        >
                            <Typography color="#e0e0e0" variant="h5" fontWeight="600">
                                Types Received Today
                    </Typography>
                        </Box>
                        <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                            {bookedUnits.typesReceivedDaily &&
                                Object.entries(bookedUnits.typesReceivedDaily).map(([type, count]) => (
                                    <Box
                                        key={type}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        borderBottom={`4px solid #1F2A40`}
                                        p="25px"
                                    >
                                        <Typography color="#e0e0e0" fontSize="18px">{type}</Typography>
                                        <Typography color="#4cceac" fontSize="18px">{count}</Typography>
                                    </Box>
                                ))}
                        </Box>
                    </Box>
                </Box>

                <Box
                    gridColumn="span 6"
                    gridRow="span 4"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="3px"
                    marginTop="20px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="18px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="93%" // Ensure it takes the full height of the parent container
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid #1F2A40`}
                            colors="#e0e0e0"
                            p="15px"
                            backgroundColor="#192231"
                        >
                            <Typography color="#e0e0e0" variant="h5" fontWeight="600">
                                Call Dispositions Today
                    </Typography>
                        </Box>
                        <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                            {bookedUnits.callDispositionDaily &&
                                Object.entries(bookedUnits.callDispositionDaily).map(([disposition, count]) => (
                                    <Box
                                        key={disposition}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        borderBottom={`4px solid #1F2A40`}
                                        p="25px"
                                    >
                                        <Typography color="#e0e0e0" fontSize="18px">{disposition}</Typography>
                                        <Typography color="#4cceac" fontSize="18px">{count}</Typography>
                                    </Box>
                                ))}
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default AgentAnalyticsTabs;