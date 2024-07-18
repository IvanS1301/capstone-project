import { Box, Button, Typography } from "@mui/material";
import React, { useState } from 'react';

/** --- OTHER MATERIAL UI ICONS --- */
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { PeopleOutlined, ContactsOutlined } from "@mui/icons-material";
import SaveAsSharpIcon from '@mui/icons-material/SaveAsSharp';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

/** --- CALL DISPOSITION ICONS --- */
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import HouseIcon from '@mui/icons-material/House';
import PhoneCallbackRoundedIcon from '@mui/icons-material/PhoneCallbackRounded';
import PhoneMissedRoundedIcon from '@mui/icons-material/PhoneMissedRounded';
import PhoneDisabledRoundedIcon from '@mui/icons-material/PhoneDisabledRounded';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

/** --- IMPORT CHART --- */
import Header from '../Chart/Header';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

const DashboardTabs = ({ inventory, recentBookings, timePeriod, onTimePeriodChange }) => {
    const [activeTimePeriod, setActiveTimePeriod] = useState(timePeriod);

    // Handle time period change
    const handleTimePeriodClick = (period) => {
        setActiveTimePeriod(period);
        onTimePeriodChange(period);
    };

    /** --- CALL DISPOSITION COUNTS --- */
    const bookedCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Booked"] || 0 : 0;
    const warmLeadCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Warm Lead"] || 0 : 0;
    const notEligibleCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Not Eligible"] || 0 : 0;
    const alreadyInstalledCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Already Installed"] || 0 : 0;
    const notWorkingCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Wrong/Not Working"] || 0 : 0;
    const residentialCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Residential"] || 0 : 0;
    const callbackCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Callback"] || 0 : 0;
    const doNotCallCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Do Not Call"] || 0 : 0;
    const noAnswerCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["No Answer"] || 0 : 0;
    const notInterested = inventory.callDispositionCounts ? inventory.callDispositionCounts["Not Interested"] || 0 : 0;
    const voicemailCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Voicemail"] || 0 : 0;

    /** --- HEADER SUBTITLE FORMAT --- */
    const formattedDate = moment(inventory.updatedAt).format('MMMM Do YYYY, h:mm:ss a');

    /** --- DOWNLOAD REPORTS AS CSV FILE --- */
    const handleDownloadReports = () => {
        const csvHeaders = [
            'Total Leads',
            'Total Users',
            'Assigned Leads',
            'Available Leads',
            'Updated Leads',
            'Telemarketer Name',
            'Lead Name',
            'Call Disposition',
            'Number of Emails',
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
            `"${inventory.numberOfLeads || 0}"`,
            `"${inventory.numberOfUsers || 0}"`,
            `"${inventory.numberOfAssignedLeads || 0}"`,
            `"${inventory.numberOfUnassignedLeads || 0}"`,
            `"${inventory.numberOfUpdatedLeads || 0}"`,
            '', '', '', '', // Empty fields for telemarketerName, leadName, and callDisposition
            `"${inventory.numberOfEmails || 0}"`,
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

        const bookingRows = recentBookings.map(booking => [
            '', '', '', '', '', // Empty fields for the total values
            `"${booking.telemarketerName || ''}"`,
            `"${booking.leadName || ''}"`,
            `"${booking.callDisposition || ''}"`,
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ]);

        const csvContent = [
            reportHeader.join(','), // Add the report header row
            csvHeaders.join(','),
            totalRow.join(','),
            ...bookingRows.map(row => row.join(','))
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
                    gridColumn="span 12"
                    display="flex"
                    gap="20px"
                    backgroundColor="#212e4a"
                    p="20px"
                    borderRadius="8px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <MonetizationOnIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{bookedCount}</Typography>
                            <Typography variant="body1" color="#4cceac">Booked</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <FireplaceIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{warmLeadCount}</Typography>
                            <Typography variant="body1" color="#4cceac">Warm Lead</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <MarkEmailReadIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfEmails}</Typography>
                            <Typography variant="body1" color="#4cceac">Emails Sent</Typography>
                        </Box>
                    </Box>
                </Box>


                {/* ROW 2 */}

                <Box
                    gridColumn="span 12"
                    display="flex"
                    gap="20px"
                    backgroundColor="#212e4a"
                    p="20px"
                    borderRadius="8px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ContactsOutlined sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfLeads}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Total Leads</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PeopleOutlined sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfUsers}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Total Users</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <SaveAsSharpIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfUpdatedLeads}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Updated Leads</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentTurnedInIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfAssignedLeads}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Assigned Leads</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <AssignmentIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfUnassignedLeads}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Available Leads</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Period Buttons */}
                <Box m="10px">
                    <Box display="flex" flexDirection="row" gap="5px" mt="30px">
                        <Button
                            variant={activeTimePeriod === 'daily' ? 'contained' : 'outlined'}
                            onClick={() => handleTimePeriodClick('daily')}
                            sx={{
                                backgroundColor: activeTimePeriod === 'daily' ? '#111827' : '#111827',
                                padding: '17px 40px',
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
                            Daily
                </Button>
                        <Button
                            variant={activeTimePeriod === 'weekly' ? 'contained' : 'outlined'}
                            onClick={() => handleTimePeriodClick('weekly')}
                            sx={{
                                backgroundColor: activeTimePeriod === 'weekly' ? '#111827' : '#111827',
                                padding: '17px 40px',
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
                            Weekly
                </Button>
                        <Button
                            variant={activeTimePeriod === 'monthly' ? 'contained' : 'outlined'}
                            onClick={() => handleTimePeriodClick('monthly')}
                            sx={{
                                backgroundColor: activeTimePeriod === 'monthly' ? '#111827' : '#111827',
                                padding: '17px 40px',
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
                            Monthly
                </Button>
                        <Button
                            variant={activeTimePeriod === 'annually' ? 'contained' : 'outlined'}
                            onClick={() => handleTimePeriodClick('annually')}
                            sx={{
                                backgroundColor: activeTimePeriod === 'annually' ? '#111827' : '#111827',
                                padding: '17px 40px',
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
                            Annually
                </Button>
                    </Box>
                </Box>

                {/* ROW 3 */}

                <Box
                    gridColumn="span 12"
                    gridRow="span 3"
                    backgroundColor="#d1d5db"
                    borderRadius="8px"
                    p="5px"
                >
                    <Box
                        backgroundColor="#111827"
                        borderRadius="8px"
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
                            <Box flexGrow={1} display="flex" flexDirection="column">
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

                {/* ROW 4 */}

                <Box
                    gridColumn="span 12"
                    display="flex"
                    gap="20px"
                    backgroundColor="#d1d5db"
                    p="20px"
                    borderRadius="8px"
                >
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ThumbDownIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{notInterested}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Not Interested</Typography>
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
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PhoneCallbackRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{callbackCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0">Callback</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box
                    gridColumn="span 12"
                    display="flex"
                    gap="20px"
                    backgroundColor="#d1d5db"
                    p="20px"
                    borderRadius="8px"
                >
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

export default DashboardTabs;
