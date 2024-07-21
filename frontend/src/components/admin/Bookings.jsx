import React, { useState } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Snackbar, IconButton, Modal, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete } from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- TIME FORMATTED --- */
import moment from 'moment';

/** --- IMPORT CONTEXT --- */
import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const Bookings = ({ recentBookings, onLeadDelete }) => {
    const { dispatch } = useAdminContext();
    const { userLG } = useAuthContext();
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    /** --- FOR DELETE BUTTON --- */
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleClick = async (bookingId) => {
        if (!userLG) {
            return;
        }
        setSelectedBookingId(bookingId);
        setShowConfirmation(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            setLoadingDelete(true);
            const response = await fetch(`${URL}/api/bookings/${selectedBookingId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${userLG.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "DELETE_BOOKING", payload: json });
                setSnackbarMessage("Booking Deleted Successfully!");
                setSnackbarOpen(true);
                // Delay the execution of onUserUpdate to show the snackbar first
                setTimeout(() => {
                    setSnackbarOpen(false);

                }, 2000); // 2 seconds delay
            }
        } catch (error) {
            setErrorDelete('Error deleting booking.');
            console.error('Error deleting booking:', error);
        } finally {
            setLoadingDelete(false);
            setShowConfirmation(false);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const iconButtonStyle = { color: "#111827" };

    const columns = [
        {
            field: "_id",
            headerName: "ID",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => params.value.slice(20, 26)
        },
        {
            field: "leadName",
            headerName: "Lead Name",
            flex: 1,
            minWidth: 300,
        },
        {
            field: "callDisposition",
            headerName: "Call Disposition",
            flex: 1,
            minWidth: 300,
            cellClassName: "name-column--cell",
        },
        {
            field: "telemarketerName",
            headerName: "Booked By",
            flex: 1,
            minWidth: 300,
        },
        {
            field: "team",
            headerName: "Team",
            flex: 1,
            minWidth: 300,
        },
        {
            field: "createdAt",
            headerName: "Time",
            flex: 1,
            minWidth: 300,
            renderCell: (params) =>
                moment(params.row.createdAt).format('MMM-D-YYYY h:mm:ss a')
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleClick(params.row._id)} style={iconButtonStyle}><Delete /></IconButton>
                </Box>
            )
        },
    ];

    /** --- HEADER SUBTITLE FORMAT --- */
    const formattedDate = moment(recentBookings.updatedAt).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <Box m="20px">
            <Box mb="20px">
                <Typography
                    variant="h4"
                    color="#111827"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0", mt: "25px" }}
                >
                    Recent Bookings
            </Typography>
                <Typography variant="h5" color="#111827">
                    {`as of ${formattedDate}`}
                </Typography>
            </Box>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        color: "#111827",
                        borderTop: `1px solid #525252 !important`,
                        fontWeight: "400"
                    },
                    "& .name-column--cell": {
                        color: "#1d4ed8",
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#111827",
                        borderBottom: "none",
                        color: "#e0e0e0",
                        fontSize: "18px",
                    },
                    "& .MuiDataGrid-sortIcon": {
                        color: "#ffffff !important", // Change sort icon color to white
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: "#d1d5db",
                        fontSize: "17px",
                    },
                    "& .MuiDataGrid-headerContainer": {
                        borderTop: "none",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: "#111827",
                        color: "#ffffff",
                    },
                    "& .MuiTablePagination-root": {
                        color: "#ffffff !important", // Ensure the pagination text is white
                    },
                    "& .MuiTablePagination-actions .MuiButtonBase-root": {
                        color: "#ffffff !important", // Ensure the pagination buttons are white
                    },
                    "& .MuiCheckbox-root": {
                        color: `#111827 !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `#111827 !important`,
                        fontWeight: "500"
                    },
                }}
            >
                <DataGrid
                    rows={recentBookings}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    checkboxSelection
                    onSelectionModelChange={(newSelection) => {
                        setSelectedRows(newSelection);
                    }}
                    selectionModel={selectedRows}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    getRowId={row => row._id}
                />
            </Box>

            <Modal
                open={loadingDelete}
                onClose={() => setLoadingDelete(false)}
                aria-labelledby="delete-lead-modal-title"
                aria-describedby="delete-lead-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    {loadingDelete ? (
                        <CircularProgress />
                    ) : (
                            <div>{errorDelete || 'Booking Deleted Successfully!'}</div>
                        )}
                </Box>
            </Modal>

            <Modal
                open={showConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="delete-confirmation-modal-title"
                aria-describedby="delete-confirmation-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: '#f1f1f1',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 5,
                        textAlign: 'center',
                        borderRadius: '30px'
                    }}
                >
                    <WarningAmberIcon sx={{ fontSize: 90, color: 'orange' }} />
                    <div style={{ fontSize: '20px', margin: '20px 0' }}>Are you sure you want to delete this booking?</div>
                    <Button onClick={handleDeleteConfirmation} variant="contained" color="primary" sx={{ mr: 2 }}>Yes</Button>
                    <Button onClick={handleCloseConfirmation} variant="contained" color="secondary">No</Button>
                </Box>
            </Modal>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                action={<CheckCircleIcon sx={{ color: '#94e2cd' }} />}
            />
        </Box>
    );
};

export default Bookings;
