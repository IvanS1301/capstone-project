import { Box, Button, Typography, Modal } from "@mui/material";
import React, { useState } from 'react';

/** --- REACT DATE RANGE --- */
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file

/** --- OTHER MATERIAL UI ICONS --- */
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { PeopleOutlined, ContactsOutlined } from "@mui/icons-material";
import SaveAsSharpIcon from '@mui/icons-material/SaveAsSharp';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

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
import EmailIcon from '@mui/icons-material/Email';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

/** --- IMPORT CHART --- */
import Header from '../Chart/Header';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

const DashboardTabs = ({ inventory, recentBookings, timePeriod, onTimePeriodChange, onDateRangeChange }) => {
    const [activeTimePeriod, setActiveTimePeriod] = useState(timePeriod);
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [tempDateRange, setTempDateRange] = useState(dateRange);

    // Handle time period change
    const handleTimePeriodClick = (period) => {
        setActiveTimePeriod(period);
        onTimePeriodChange(period);
    };

    const handleToggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleSelect = (ranges) => {
        setTempDateRange([ranges.selection]);
    };

    const handleApplyDateRange = () => {
        setDateRange(tempDateRange);
        onDateRangeChange(tempDateRange[0]);
        handleToggleCalendar();
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
    const emailCount = inventory.callDispositionCounts ? inventory.callDispositionCounts["Email"] || 0 : 0;

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

                <Box display="flex" alignItems="center" gap="15px">
                    <Button
                        variant="contained"
                        onClick={handleToggleCalendar}
                        sx={{
                            backgroundColor: '#3e4396',
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
                                boxShadow: '0px 0px 9px 0px rgb(93 24 220)',
                            }
                        }}
                    >
                        <CalendarMonthIcon sx={{ mr: "10px", mb: "5px" }} />
                        Open Calendar
            </Button>

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
                                boxShadow: '0px 0px 9px 0px rgb(93 24 220)',
                            }
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px", mb: "5px" }} />
                        Download Reports
            </Button>
                </Box>
            </Box>

            {/* Modal for DateRangePicker */}
            <Modal
                open={showCalendar}
                onClose={handleToggleCalendar}
                aria-labelledby="calendar-modal-title"
                aria-describedby="calendar-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="background.paper"
                    boxShadow={24}
                    p={4}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '600px',
                        borderRadius: '12px'
                    }}
                >
                    <Typography id="calendar-modal-title" variant="h6" component="h2" sx={{ mb: '20px' }}>
                        Select Date Range
                    </Typography>
                    <DateRangePicker
                        ranges={tempDateRange}
                        onChange={handleSelect}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        direction="horizontal"
                    />
                    <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
                        <Button
                            onClick={handleToggleCalendar}
                            sx={{
                                backgroundColor: "#3e4396",
                                color: "#fff",
                                fontWeight: "bold",
                                '&:hover': {
                                    backgroundColor: "#2c3173"
                                },
                                flex: 1,
                                marginRight: '10px'
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleApplyDateRange}
                            sx={{
                                backgroundColor: "#e1306c",
                                color: "#fff",
                                fontWeight: "bold",
                                '&:hover': {
                                    backgroundColor: "#c13584"
                                },
                                flex: 1
                            }}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                            <Typography variant="body1" color="#4cceac" fontSize="20px" fontWeight="600">Booked</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <FireplaceIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{warmLeadCount}</Typography>
                            <Typography variant="body1" color="#4cceac" fontSize="20px" fontWeight="600">Warm Lead</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <MarkEmailReadIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{inventory.numberOfEmails}</Typography>
                            <Typography variant="body1" color="#4cceac" fontSize="20px" fontWeight="600">Emails Sent</Typography>
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
                <Box mb="20px">
                    <Box display="flex" gap="5px" mt="20px">
                        <Button
                            variant={activeTimePeriod === 'daily' ? 'contained' : 'outlined'}
                            onClick={() => handleTimePeriodClick('daily')}
                            sx={{
                                backgroundColor: activeTimePeriod === 'daily' ? '#111827' : '#111827',
                                padding: '19px 70px',
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
                                    boxShadow: '0px 0px 9px 0px rgb(93 24 220)',
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
                                padding: '19px 60px',
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
                                    boxShadow: '0px 0px 9px 0px rgb(93 24 220)',
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
                                padding: '19px 60px',
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
                                    boxShadow: '0px 0px 9px 0px rgb(93 24 220)',
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
                                padding: '19px 60px',
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
                                    boxShadow: '0px 0px 9px 0px rgb(93 24 220)',
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
                    mt="-50px"
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
                            p="15px"
                            backgroundColor="#192231"
                        >
                            <Typography color="#e0e0e0" variant="h5" fontSize="25px" fontWeight="600">
                                Recent Bookings
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" height="100%" overflow="auto">
                            <Box
                                display="flex"
                                justifyContent="space-around"
                                alignItems="center"
                                borderBottom="2px solid #1F2A40"
                                px="15px"
                                py="10px"
                                backgroundColor="#192231"
                            >
                                <Typography color="#e0e0e0" variant="subtitle1" fontSize="19px" fontWeight="600" flex={1} textAlign="left">
                                    Telemarketer Name
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontSize="19px" fontWeight="600" flex={1} textAlign="left">
                                    Team
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontSize="19px" fontWeight="600" flex={1} textAlign="left">
                                    Lead Name
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontSize="19px" fontWeight="600" flex={1} textAlign="left">
                                    Call Disposition
                                </Typography>
                                <Typography color="#e0e0e0" variant="subtitle1" fontSize="19px" fontWeight="600" flex={1} textAlign="left">
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
                                        <Typography color="#e0e0e0" fontSize="19px" flex={1} textAlign="left">
                                            {booking.telemarketerName}
                                        </Typography>
                                        <Typography color="#4cceac" fontSize="19px" flex={1} textAlign="left">
                                            {booking.team}
                                        </Typography>
                                        <Typography color="#e0e0e0" fontSize="19px" flex={1} textAlign="left">
                                            {booking.leadName}
                                        </Typography>
                                        <Box
                                            flex={1}

                                            p="5px 10px"
                                            borderRadius="4px"
                                            textAlign="left"
                                        >
                                            <Typography color="#4cceac" fontSize="19px">
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
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Not Interested</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <DoneAllRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{alreadyInstalledCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Already Installed</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <ErrorRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{notWorkingCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Wrong / Not Working</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PhoneCallbackRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{callbackCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Callback</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <EmailIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{emailCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Email</Typography>
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
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Do Not Call</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <PhoneDisabledRoundedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{noAnswerCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">No Answer</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <VoicemailIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{voicemailCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Voicemail</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <HouseIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{residentialCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Residential</Typography>
                        </Box>
                    </Box>
                    <Box flex="1" display="flex" alignItems="center" justifyContent="center" backgroundColor="#111827" p="10px" borderRadius="8px">
                        <NotInterestedIcon sx={{ color: "#f1f1f1", fontSize: "40px", mr: "50px" }} />
                        <Box>
                            <Typography variant="h3" color="#e0e0e0">{notEligibleCount}</Typography>
                            <Typography variant="body1" color="#e0e0e0" fontSize="20px" fontWeight="200">Not Eligible</Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Box>
    );
};

export default DashboardTabs;
