/** --- MATERIAL UI --- */
import { Box, Typography, Button } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

/** --- IMPORT CHART --- */
import Header from '../Chart/Header';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

const AgentAnalyticsTabs = ({ bookedUnits, recentBookings }) => {
    if (!bookedUnits || !recentBookings) {
        return <Typography variant="h6" color="error">No data available</Typography>;
    }

    /** --- DOWNLOAD REPORTS AS CSV FILE --- */
    const handleDownloadReports = () => {
        const csvHeaders = [
            'Assigned Leads Daily',
            'Booked Daily',
            'Booked Month-to-Date',
            'All Time',
            'Types Received Today',
            'Count',
            'Call Dispositions Today',
            'Count'
        ];

        // Report header row
        const reportHeader = [
            'ANALYTICS REPORT',
            `Statistics for Today`
        ];

        const totalRow = [
            `"${bookedUnits.assignedDaily || 0}"`,
            `"${bookedUnits.bookedDaily || 0}"`,
            `"${bookedUnits.bookedMonth || 0}"`,
            `"${bookedUnits.totalBooked || 0}"`,
            '', '', // Empty fields for type, and count
            '', '', // Empty fields for callDisposition, and count
        ];

        const typesReceivedRows = Object.entries(bookedUnits.typesReceivedDaily || {}).map(([type, count]) => [
            '', '', '', '', // Empty fields for the total values
            `"${type}"`,
            `"${count}"`,
            '', '' // Empty fields for callDisposition, and count
        ]);

        const callDispositionsRows = Object.entries(bookedUnits.callDispositionDaily || {}).map(([disposition, count]) => [
            '', '', '', '', // Empty fields for the total values
            '', '', // Empty fields for type, and count
            `"${disposition}"`,
            `"${count}"`
        ]);

        const csvContent = [
            reportHeader.join(','), // Add the report header row
            csvHeaders.join(','),
            totalRow.join(','),
            ...typesReceivedRows.map(row => row.join(',')),
            ...callDispositionsRows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics_report_${moment().format('YYYYMMDD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#111827", padding: "1px 5px", borderRadius: "8px", marginBottom: "20px" }}>
                <Header title="Booked Summary" subtitle="Statistics for Today" />

                <Box>
                    <Button
                        onClick={handleDownloadReports}
                        sx={{
                            backgroundColor: "#3e4396",
                            color: "#e0e0e0",
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            mr: "30px"
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
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

                {/* ROW 2 */}

                <Box
                    gridColumn="span 12"
                    gridRow="span 3"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="3px"
                    marginTop="10px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="18px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="90%" // Ensure it takes the full height of the parent container
                        display="flex"
                        flexDirection="column"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom="2px solid #1F2A40"
                            px="15px"
                            py="10px"
                            backgroundColor="#192231"
                        >
                            <Typography color="#e0e0e0" variant="h5" fontWeight="600" flex={1} textAlign="left">
                                Recent Bookings
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" height="100%">
                            <Box
                                display="flex"
                                justifyContent="space-around"
                                alignItems="center"
                                borderBottom="2px solid #1F2A40"
                                px="15px"
                                py="10px"
                                backgroundColor="#192231"
                            >
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Telemarketer Name
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Team
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Lead Name
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Call Disposition
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Date
                                </Typography>
                            </Box>
                            <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                                {recentBookings.map((booking) => (
                                    <Box
                                        key={booking._id}
                                        display="flex"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        borderBottom="2px solid #1F2A40"
                                        px="15px"
                                        py="10px"
                                        backgroundColor="#111827"
                                    >
                                        <Typography color="#e0e0e0" fontSize="17px" flex={1} textAlign="left">
                                            {booking.telemarketerName}
                                        </Typography>
                                        <Typography color="#4cceac" fontSize="17px" flex={1} textAlign="left">
                                            {booking.team}
                                        </Typography>
                                        <Typography color="#e0e0e0" fontSize="17px" flex={1} textAlign="left">
                                            {booking.leadName}
                                        </Typography>
                                        <Box
                                            flex={1}

                                            p="5px 10px"
                                            borderRadius="4px"
                                            textAlign="left"
                                        >
                                            <Typography color="#4cceac" fontSize="17px">
                                                {booking.callDisposition}
                                            </Typography>
                                        </Box>
                                        <Typography color="#e0e0e0" variant="body2" fontSize="17px" flex={1} textAlign="left">
                                            {moment(booking.createdAt).format('MMM D, YYYY h:mm A')}
                                        </Typography>
                                    </Box>
                                ))}
                                {/* Add an empty Box to ensure full height */}
                                {recentBookings.length === 0 && (
                                    <Box flexGrow={1} />
                                )}
                            </Box>
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
                    marginTop="10px"
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
                    marginTop="10px"
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
