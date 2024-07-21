/** --- MATERIAL UI --- */
import { Box, Button, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { ContactsOutlined } from "@mui/icons-material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TodayIcon from '@mui/icons-material/Today';

/** --- IMPORT CHART DESIGN --- */
import Header from '../Chart/Header';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

const LGDashboardTabs = ({ leadGenStats, leads }) => {

    /** --- HEADER SUBTITLE FORMAT --- */
    const formattedDate = moment(leadGenStats.updatedAt).format('MMMM Do YYYY, h:mm:ss a');

    /** --- DOWNLOAD REPORTS AS CSV FILE --- */
    const handleDownloadReports = () => {
        const csvHeaders = [
            'Leads Today',
            'Total Leads',
            'Leads Assigned',
            'Leads Available',
            'Recent Leads',
            'Suburb',
            'Type',
            'Lead Gen Date',
        ];

        // Report header row
        const reportHeader = [
            'DASHBOARD REPORT',
            `As of ${formattedDate}`
        ];

        const totalRow = [
            `"${leadGenStats.leadsCreatedToday || 0}"`,
            `"${leadGenStats.leadsCreated || 0}"`,
            `"${leadGenStats.leadsAssigned || 0}"`,
            `"${leadGenStats.leadsAvailable || 0}"`,
            '', '', '', '', // Empty fields for leadName, leadCity, leadType, and Date
        ];

        const leadRows = leads.map(lead => [
            '', '', '', '', // Empty fields for the total values
            `"${lead.name || ''}"`,
            `"${lead.city || ''}"`,
            `"${lead.type || ''}"`,
            `"${lead.createdAt || ''}"`,
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ]);

        const csvContent = [
            reportHeader.join(','), // Add the report header row
            csvHeaders.join(','),
            totalRow.join(','),
            ...leadRows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `dashboard_report_${formattedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#111827", padding: "1px 5px", borderRadius: "8px", marginBottom: "20px" }}>
                <Header title="DASHBOARD" subtitle={`as of ${formattedDate}`} />

                <Box>
                    <Button
                        onClick={handleDownloadReports}
                        sx={{
                            backgroundColor: '#3e4396',
                            padding: '17px 40px',
                            marginRight: '25px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: 0,
                            color: '#e0e0e0',
                            boxShadow: '0 0 8px rgba(0, 0, 0, 0.05)',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            fontSize: '15px',
                            transition: 'all 0.5s ease',
                            '&:hover': {
                                letterSpacing: '3px',
                                backgroundColor: 'hsl(261deg 80% 48%)',
                                color: 'hsl(0, 0%, 100%)',
                                boxShadow: '0px 7px 29px 0px rgb(93 24 220)',
                            }
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
                        <TodayIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{leadGenStats.leadsCreatedToday}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Leads Today</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ContactsOutlined sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{leadGenStats.leadsCreated}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Total Leads</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentIndIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{leadGenStats.leadsAssigned}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Leads Assigned</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{leadGenStats.leadsAvailable}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Leads Available</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ROW 2 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 4"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="3px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="8px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="93%" // Ensure it takes the full height of the parent container
                        display="flex"
                        flexDirection="column"
                    >

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
                                    Recent Leads
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Suburb
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Type
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Date
                                </Typography>
                            </Box>
                            <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                                {leads.map((lead) => (
                                    <Box
                                        key={lead._id}
                                        display="flex"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        borderBottom="2px solid #1F2A40"
                                        px="15px"
                                        py="10px"
                                        backgroundColor="#111827"
                                    >
                                        <Typography color="#e0e0e0" fontSize="17px" flex={1} textAlign="left">
                                            {lead.name}
                                        </Typography>
                                        <Typography color="#e0e0e0" fontSize="17px" flex={1} textAlign="left">
                                            {lead.city}
                                        </Typography>
                                        <Box
                                            flex={1}

                                            p="5px 10px"
                                            borderRadius="4px"
                                            textAlign="left"
                                        >
                                            <Typography color="#4cceac" fontSize="17px">
                                                {lead.type}
                                            </Typography>
                                        </Box>
                                        <Typography color="#e0e0e0" variant="body2" fontSize="17px" flex={1} textAlign="left">
                                            {moment(lead.createdAt).format('MMM D, YYYY h:mm A')}
                                        </Typography>
                                    </Box>
                                ))}
                                {/* Add an empty Box to ensure full height */}
                                {leads.length === 0 && (
                                    <Box flexGrow={1} />
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box
                    gridColumn="span 4"
                    gridRow="span 4"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="3px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="8px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="93%" // Ensure it takes the full height of the parent container
                        display="flex"
                        flexDirection="column"
                    >
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
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={9} textAlign="left">
                                    Types Created
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontWeight="600" flex={1} textAlign="left">
                                    Count
                                </Typography>
                            </Box>
                            <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                                {leadGenStats.typesCreated &&
                                    Object.entries(leadGenStats.typesCreated).map(([type, count]) => (
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
                </Box>

            </Box>
        </Box>
    );
};

export default LGDashboardTabs;
