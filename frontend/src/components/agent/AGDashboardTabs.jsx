import { Box, Button, Typography } from "@mui/material";

/** --- OTHER MATERIAL UI ICONS --- */
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ContactsOutlined } from "@mui/icons-material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

/** --- CALL DISPOSITION ICONS --- */
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import HouseIcon from '@mui/icons-material/House';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import PhoneCallbackRoundedIcon from '@mui/icons-material/PhoneCallbackRounded';
import PhoneMissedRoundedIcon from '@mui/icons-material/PhoneMissedRounded';
import PhoneDisabledRoundedIcon from '@mui/icons-material/PhoneDisabledRounded';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

/** --- IMPORT CHART --- */
import Header from '../Chart/Header';
import ProgressCircle from "../Chart/ProgressCircle";

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

const AGDashboardTabs = ({ bookedUnits, unassignedLeads }) => {

    /** --- CALL DISPOSITION COUNTS --- */
    const bookedCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Booked"] || 0 : 0;
    const warmLeadCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Warm Lead"] || 0 : 0;
    const notEligibleCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Not Eligible"] || 0 : 0;
    const alreadyInstalledCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Already Installed"] || 0 : 0;
    const notWorkingCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Wrong/Not Working"] || 0 : 0;
    const residentialCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Residential"] || 0 : 0;
    const callbackCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Callback"] || 0 : 0;
    const doNotCallCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Do Not Call"] || 0 : 0;
    const noAnswerCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["No Answer"] || 0 : 0;
    const notInterested = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Not Interested"] || 0 : 0;
    const voicemailCount = bookedUnits.callDispositionCreated ? bookedUnits.callDispositionCreated["Voicemail"] || 0 : 0;

    /** --- HEADER SUBTITLE FORMAT --- */
    const formattedDate = moment(bookedUnits.updatedAt).format('MMMM Do YYYY, h:mm:ss a');

    /** --- DOWNLOAD REPORTS AS CSV FILE --- */
    const handleDownloadReports = () => {
        const csvHeaders = [
            'Assigned Leads Daily',
            'Assigned Leads Yesterday',
            'Assigned Lead Status',
            'Total Assigned Leads',
            'Lead Name',
            'Lead City',
            'Lead Type',
            'Emails Sent',
            'Booked Count',
            'Warm Lead Count',
            'Not Eligible Count',
            'Already Installed Count',
            'Not Working Count',
            'Residential Count',
            'Callback Count',
            'Do Not Call Count',
            'No Answer Count',
            'Not Interested Count',
            'Voicemail Count'
        ];

        // Report header row
        const reportHeader = [
            'DASHBOARD REPORT',
            `As of ${formattedDate}`
        ];

        const totalRow = [
            `"${bookedUnits.assignedDaily || 0}"`,
            `"${bookedUnits.assignedYesterday || 0}"`,
            `"${bookedUnits.assignedLeadStatus || 0}"`,
            `"${bookedUnits.totalAssignedLeads || 0}"`,
            '', '', '', // Empty fields for telemarketerName, leadName, and callDisposition
            `"${bookedUnits.emailsSent || 0}"`,
            `"${bookedCount || 0}"`,
            `"${warmLeadCount || 0}"`,
            `"${notEligibleCount || 0}"`,
            `"${alreadyInstalledCount || 0}"`,
            `"${notWorkingCount || 0}"`,
            `"${residentialCount || 0}"`,
            `"${callbackCount || 0}"`,
            `"${doNotCallCount || 0}"`,
            `"${noAnswerCount || 0}"`,
            `"${notInterested || 0}"`,
            `"${voicemailCount || 0}"`
        ];

        const unassignedRows = unassignedLeads.map(unassigned => [
            '', '', '', '', // Empty fields for the total values
            `"${unassigned.name || ''}"`,
            `"${unassigned.city || ''}"`,
            `"${unassigned.type || ''}"`,
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ]);

        const csvContent = [
            reportHeader.join(','), // Add the report header row
            csvHeaders.join(','),
            totalRow.join(','),
            ...unassignedRows.map(row => row.join(','))
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
                gap="15px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 9"
                    display="flex"
                    gap="20px"
                    backgroundColor="#212e4a"
                    p="20px"
                    borderRadius="18px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ContactsOutlined sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.assignedLeadStatus}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Lead Status</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <WorkHistoryIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.assignedYesterday}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Assigned Yesterday</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentTurnedInIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.assignedLeadsAvailable}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Leads Available</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedUnits.totalAssignedLeads}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Total Assigned Leads</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ROW 2 */}
                <Box
                    gridColumn="span 3"
                    gridRow="span 2"
                    backgroundColor="#101624"
                    p="30px"
                    borderRadius="18px"
                >
                    <Typography variant="h5" fontWeight="600" color="#e0e0e0">
                        New Assigned Leads
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt="25px"
                    >
                        <ProgressCircle size="125" progress={bookedUnits.assignedDaily} showText={true} text={bookedUnits.assignedDaily} />
                        <Typography
                            variant="h5"
                            color="#4cceac"
                            sx={{ mt: "15px" }}
                        >
                            Assigned Leads Daily
                        </Typography>
                    </Box>
                </Box>

                <Box
                    gridColumn="span 9"
                    gridRow="span 3"
                    backgroundColor="#d1d5db"
                    borderRadius="18px"
                    p="3px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="18px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="91%" // Ensure it takes the full height of the parent container
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
                                Recent Assigned Leads
    </Typography>
                        </Box>
                        <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                            {unassignedLeads.map((unassigned) => (
                                <Box
                                    key={unassigned._id}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    borderBottom={`2px solid #1F2A40`}
                                    p="15px"
                                >
                                    <Box flex={1}>
                                        <Typography color="#e0e0e0" fontSize="17px">
                                            {unassigned.name}
                                        </Typography>
                                    </Box>
                                    <Box flex={1} color="#e0e0e0" fontSize="17px">{unassigned.city}</Box>
                                    <Box
                                        flex={1}
                                        backgroundColor="#43ba9b"
                                        p="5px 10px"
                                        borderRadius="4px"
                                        textAlign="center"
                                        maxWidth="100px" // Adjust the width as needed
                                    >
                                        {unassigned.type}
                                    </Box>
                                    <Box flex={1} textAlign="right">
                                        <Typography color="#e0e0e0" variant="body2" fontSize="17px">
                                            {moment(unassigned.Distributed).format('MMM D, YYYY h:mm A')}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* ROW 3 */}
                <Box
                    gridColumn="span 3"
                    gridRow="span 7"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="3px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="18px"
                        overflow="hidden"
                        m="20px" // Add margin to ensure proper alignment
                        height="96%" // Ensure it takes the full height of the parent container
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
                                Types Received
                    </Typography>
                        </Box>
                        <Box flexGrow={1} display="flex" flexDirection="column" overflow="auto">
                            {bookedUnits.typesReceived &&
                                Object.entries(bookedUnits.typesReceived).map(([type, count]) => (
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
                    gridColumn="span 3"
                    gridRow="span 2"
                    backgroundColor="#101624"
                    p="30px"
                    borderRadius="18px"
                >
                    <Typography variant="h5" fontWeight="600" color="#e0e0e0">
                        Emails Sent
          </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt="25px"
                    >
                        <ProgressCircle size="125" progress={bookedUnits.emailsSent} showText={true} text={bookedUnits.emailsSent} />
                        <Typography
                            variant="h5"
                            color="#4cceac"
                            sx={{ mt: "15px" }}
                        >
                            emails generated
            </Typography>
                    </Box>
                </Box>
                <Box
                    gridColumn="span 3"
                    gridRow="span 2"
                    backgroundColor="#101624"
                    p="30px"
                    borderRadius="18px"
                >
                    <Typography variant="h5" fontWeight="600" color="#e0e0e0">
                        Booked
          </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt="25px"
                    >
                        <ProgressCircle size="125" progress={bookedCount} showText={true} text={bookedCount} />
                        <Typography
                            variant="h5"
                            color="#4cceac"
                            sx={{ mt: "15px" }}
                        >
                            booked generated
            </Typography>
                    </Box>
                </Box>

                <Box
                    gridColumn="span 3"
                    gridRow="span 2"
                    backgroundColor="#101624"
                    p="30px"
                    borderRadius="18px"
                >
                    <Typography variant="h5" fontWeight="600" color="#e0e0e0">
                        Warm Lead
          </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt="25px"
                    >
                        <ProgressCircle size="125" progress={warmLeadCount} showText={true} text={warmLeadCount} />
                        <Typography
                            variant="h5"
                            color="#4cceac"
                            sx={{ mt: "15px" }}
                        >
                            warm lead generated
            </Typography>
                    </Box>
                </Box>

                {/* ROW 4 */}
                <Box
                    gridColumn="span 9"
                    display="flex"
                    gap="20px"
                    backgroundColor="#d1d5db"
                    p="20px"
                    borderRadius="18px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <NotInterestedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{notEligibleCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Not Eligible</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <DoneAllRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{alreadyInstalledCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Already Installed</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ErrorRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{notWorkingCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Wrong / Not Working</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ROW 5 */}
                <Box
                    gridColumn="span 9"
                    display="flex"
                    gap="20px"
                    backgroundColor="#d1d5db"
                    p="20px"
                    borderRadius="18px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PhoneCallbackRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{callbackCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Callback</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PhoneMissedRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{doNotCallCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Do Not Call</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PhoneDisabledRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{noAnswerCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">No Answer</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ROW 6 */}
                <Box
                    gridColumn="span 9"
                    display="flex"
                    gap="20px"
                    backgroundColor="#d1d5db"
                    p="20px"
                    borderRadius="18px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ThumbDownIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{notInterested}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Not Interested</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <VoicemailIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{voicemailCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Voicemail</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <HouseIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{residentialCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Residential</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AGDashboardTabs;
