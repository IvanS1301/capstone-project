import React, { useState } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Typography, Paper, Avatar, IconButton, Modal, CircularProgress, Snackbar, Alert } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

/** --- CONTEXT --- */
import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- DATE RANGE --- */
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { saveAs } from 'file-saver'; // Import file-saver library

const StatusLists = ({ statuses, onStatusUpdate, onFilter }) => {
    const { dispatch } = useAdminContext();
    const { userLG } = useAuthContext();

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('success');
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const handleDeleteClick = (statusId) => {
        setStatusToDelete(statusId);
        setShowConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        setStatusToDelete(null);
    };

    const handleDeleteConfirmation = async () => {
        setShowConfirmation(false);
        setLoadingDelete(true);
        setErrorDelete(null);

        try {
            const response = await fetch(`${URL}/api/status/${statusToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userLG.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'DELETE_STATUS', payload: json });
                setFeedbackMessage('Status deleted successfully.');
                setFeedbackType('success');
                setOpenSuccessModal(true); // Open success modal
                // Delay the execution of onUserUpdate to show the modal first
                setTimeout(() => {
                    setOpenSuccessModal(false);
                    onStatusUpdate();
                }, 2000); // 2 seconds delay
            } else {
                setErrorDelete(json.error || 'Failed to delete status');
                setFeedbackMessage('Failed to delete status.');
                setFeedbackType('error');
            }
        } catch (error) {
            setErrorDelete('Error deleting status');
            setFeedbackMessage('Error deleting status.');
            setFeedbackType('error');
        } finally {
            setLoadingDelete(false);
        }
    };

    const handleFilter = () => {
        const { startDate, endDate } = dateRange[0];
        onFilter(startDate, endDate);
        setIsCalendarOpen(false);
        setFeedbackMessage('Filter applied successfully.');
        setFeedbackType('success');
    };

    const handleCalendarOpen = () => {
        setIsCalendarOpen(true);
    };

    const handleCalendarClose = () => {
        setIsCalendarOpen(false);
    };

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
    };

    /** --- DOWNLOAD REPORTS AS CSV FILE --- */
    const handleDownloadReports = () => {
        // Define CSV headers
        const csvHeaders = [
            'Employee Name',
            'Status',
            'Role',
            'Date'
        ];

        // Report header row
        const reportHeader = [
            'STATUS REPORT',
            `As of ${moment().format('MMMM Do YYYY, h:mm:ss a')}`
        ];

        // Prepare report rows
        const statusRows = statuses.map(status => [
            `"${status.employeeName || ''}"`,
            `"${status.status || ''}"`,
            `"${status.role || ''}"`,
            `"${moment(status.createdAt).format('MMM D, YYYY h:mm A') || ''}"`
        ]);

        // Convert data to CSV format
        const csvContent = [
            reportHeader.join(','), // Add the report header row
            csvHeaders.join(','),
            ...statusRows.map(row => row.join(','))
        ].join('\n');

        // Create and download CSV file using FileSaver.js
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `status_report_${moment().format('YYYY-MM-DD')}.csv`);
    };

    return (
        <Box m="40px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#fff", padding: "20px 40px", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", mb: "30px", mt: "-20px" }}>
                {/* Left Side - Title and Subtitle */}
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: "#e1306c", marginRight: "20px", width: "60px", height: "60px" }}>
                        <PermContactCalendarIcon sx={{ color: "#fff", fontSize: "28px" }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ color: "#333", fontWeight: "bold", mb: "5px" }}>
                            STATUS LOGS
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#888" }}>
                            {`as of ${moment().format('MMMM Do YYYY, h:mm:ss a')}`}
                        </Typography>
                    </Box>
                </Box>

                {/* Right Side - Date Range Picker and Buttons */}
                <Box display="flex" alignItems="center">
                    <Button
                        onClick={handleCalendarOpen}
                        sx={{
                            backgroundColor: "#e1306c",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding: "12px 24px",
                            borderRadius: "30px",
                            marginLeft: "10px",
                            '&:hover': {
                                backgroundColor: "#2c3173"
                            }
                        }}
                    >
                        <FilterAltOffIcon sx={{ mr: "12px", fontSize: "20px" }} />
                        Filter by Date
                    </Button>
                    <Button
                        onClick={handleDownloadReports}
                        sx={{
                            backgroundColor: "#e1306c",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "bold",
                            padding: "12px 24px",
                            borderRadius: "30px",
                            marginLeft: "10px",
                            '&:hover': {
                                backgroundColor: "#2c3173"
                            }
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "12px", fontSize: "20px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            {/* Status Logs */}
            {statuses.map((status) => (
                <Box key={status._id} display="flex" alignItems="flex-start" mb="30px">
                    <Avatar sx={{ bgcolor: "#3e4396", marginRight: "20px", width: "50px", height: "50px" }}>
                        {status.employeeName.charAt(0)}
                    </Avatar>
                    <Paper elevation={3} sx={{ padding: "20px", borderRadius: "12px", flexGrow: 1, position: 'relative' }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3e4396" }}>
                            {status.employeeName} <span style={{ color: "#000", fontWeight: "normal" }}>updated status to</span> {status.status}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#666" }}>
                            {status.role}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999", display: "block", mt: "10px" }}>
                            {moment(status.createdAt).format('MMM D, YYYY h:mm A')}
                        </Typography>
                        {/* Delete Button */}
                        <IconButton
                            onClick={() => handleDeleteClick(status._id)}
                            sx={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                color: '#333',
                                backgroundColor: '#e2e8f0',
                                padding: '8px',
                                borderRadius: '50px',
                                '&:hover': {
                                    color: '#333'
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Paper>
                </Box>
            ))}

            {/* Success Modal */}
            <Modal
                open={openSuccessModal}
                onClose={handleCloseSuccessModal}
                className="bounce-in-modal"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper elevation={5} sx={{ padding: '40px', borderRadius: '16px', maxWidth: '600px', width: '90%', textAlign: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '80px', mb: '30px' }} />
                    <Typography variant="h5" sx={{ mb: '20px', fontSize: '24px' }}>
                        Success!
        </Typography>
                    <Typography variant="body1" sx={{ fontSize: '24px' }}>
                        {feedbackMessage}
                    </Typography>
                </Paper>
            </Modal>

            {/* Calendar Modal */}
            <Modal open={isCalendarOpen} onClose={handleCalendarClose} className="bounce-in-modal">
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
                    <Typography variant="h6" sx={{ mb: '20px' }}>
                        Select Date Range
                    </Typography>
                    <DateRangePicker
                        ranges={dateRange}
                        onChange={(item) => setDateRange([item.selection])}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        direction="horizontal"
                    />
                    <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
                        <Button
                            onClick={handleCalendarClose}
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
                            onClick={handleFilter}
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

            <Modal
                open={showConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper
                    elevation={5}
                    className="bounce-in-modal" // Apply the zoom-in animation class
                    sx={{
                        padding: '40px',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '90%',
                        textAlign: 'center'
                    }}
                >
                    <WarningAmberIcon sx={{ color: '#ff9800', fontSize: '70px', mb: '30px' }} />
                    <Typography variant="h5" sx={{ mb: '20px', fontSize: '24px' }}>
                        Are you sure you want to delete this status?
                </Typography>
                    {errorDelete && (
                        <Alert severity="error" sx={{ mb: '30px' }}>
                            {errorDelete}
                        </Alert>
                    )}
                    <Box display="flex" justifyContent="center" mt="35px" gap="20px">
                        <Button
                            onClick={handleCloseConfirmation}
                            sx={{
                                backgroundColor: '#9e9e9e',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#757575' },
                                padding: '12px 24px',
                                fontSize: '16px'
                            }}
                        >
                            Cancel
                    </Button>
                        <Button
                            onClick={handleDeleteConfirmation}
                            sx={{
                                backgroundColor: '#f44336',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#d32f2f' },
                                padding: '12px 24px',
                                fontSize: '16px'
                            }}
                        >
                            {loadingDelete ? <CircularProgress size={24} /> : 'Confirm'}
                        </Button>
                    </Box>
                </Paper>
            </Modal>

            <Modal
                open={loadingDelete}
                aria-labelledby="loading-modal-title"
                aria-describedby="loading-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#f1f1f1',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '30px'
                    }}
                >
                    <CircularProgress sx={{ fontSize: 60 }} />
                    <div style={{ fontSize: '20px', marginTop: '10px' }}>Deleting, please wait...</div>
                </Box>
            </Modal>

            {/* Snackbar for feedback */}
            <Snackbar
                open={feedbackMessage !== ''}
                autoHideDuration={6000}
                onClose={() => setFeedbackMessage('')}
            >
                <Alert onClose={() => setFeedbackMessage('')} severity={feedbackType} sx={{ width: '100%' }}>
                    {feedbackMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StatusLists;
