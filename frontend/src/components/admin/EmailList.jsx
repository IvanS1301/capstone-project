import React, { useState } from 'react'
import { URL } from "../../utils/URL";

/** --- IMPORT CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- MATERIAL UI --- */
import { Box, Button, Snackbar, IconButton, Modal, CircularProgress, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Visibility } from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT REACT ROUTER --- */
import { Link } from 'react-router-dom';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment'

/** --- IMPORT CHART --- */
import CustomToolbar from '../Chart/CustomToolbar';

const EmailList = ({ emails, userlgs, onEmailDelete }) => {
    const { dispatch } = useEmailsContext();
    const { userLG } = useAuthContext();
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedEmailId, setSelectedEmailId] = useState(null);

    /** --- FOR DELETE BUTTON --- */
    const [loadingDelete, setLoadingDelete] = useState(false); // State for delete loading
    const [errorDelete, setErrorDelete] = useState(null); // State for delete error
    const [showConfirmation, setShowConfirmation] = useState(false); // State for showing delete confirmation dialog
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open
    const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message

    const userIdToNameMap = userlgs.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
    }, {});

    const handleClick = async (emailId) => {
        if (!userLG) {
            return;
        }
        setSelectedEmailId(emailId);
        setShowConfirmation(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            setLoadingDelete(true); // Start delete loading
            const response = await fetch(`${URL}/api/emails/${selectedEmailId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${userLG.token}`
                }
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "DELETE_EMAIL", payload: json });
                setSnackbarMessage("Email Deleted Successfully!");
                setSnackbarOpen(true);
                // Delay the execution of onEmailDelete to show the snackbar first
                setTimeout(() => {
                    setSnackbarOpen(false);

                }, 2000); // 2 seconds delay
            }
        } catch (error) {
            setErrorDelete('Error deleting email.'); // Set delete error
            console.error('Error deleting email:', error);
        } finally {
            setLoadingDelete(false); // Stop delete loading
            setShowConfirmation(false); // Close confirmation dialog
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false); // Close confirmation dialog
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
            minWidth: 150,
            renderCell: (params) => params.value.slice(20, 26)
        },
        {
            field: "from",
            headerName: "From",
            flex: 1,
            minWidth: 280,
        },
        {
            field: "to",
            headerName: "To",
            flex: 1,
            minWidth: 300,
            cellClassName: "name-column--cell",
        },
        {
            field: "subject",
            headerName: "Subject",
            flex: 1,
            minWidth: 400,
        },
        {
            field: "text",
            headerName: "Text",
            flex: 1,
            minWidth: 250,
        },
        {
            field: "userLG_id",
            headerName: "Submitted By",
            flex: 1,
            minWidth: 180,
            cellClassName: "name-column--cell",
            renderCell: (params) => userIdToNameMap[params.value] || params.value,
        },
        {
            field: "createdAt",
            headerName: "Sent",
            flex: 1,
            minWidth: 180,
            renderCell: (params) =>
                moment(params.row.createdAt).startOf('minute').fromNow()
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton component={Link} to={`/viewemail/${params.row._id}`} style={iconButtonStyle}>
                        <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleClick(params.row._id)} style={iconButtonStyle}>
                        <Delete />
                    </IconButton>
                </Box>
            )
        },
    ];

    /** --- HEADER SUBTITLE FORMAT --- */
    const formattedDate = moment(emails.updatedAt).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <Box m="20px">
            <Box mb="20px">
                <Typography
                    variant="h4"
                    color="#111827"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0", mt: "25px" }}
                >
                    EMAILS
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
                        fontSize: "18px"
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
                        color: `#e0e0e0 !important`,
                        fontWeight: "500"
                    },
                }}
            >
                <DataGrid
                    rows={emails}
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
                        toolbar: CustomToolbar,
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
                        p: 5,
                        textAlign: 'center',
                    }}
                >
                    {loadingDelete ? (
                        <CircularProgress /> // Show CircularProgress while deleting
                    ) : (
                            <div>{errorDelete || 'Email Deleted Successfully!'}</div> // Show error or success message
                        )}
                </Box>
            </Modal>

            <Modal
                open={showConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="delete-confirmation-modal-title"
                aria-describedby="delete-confirmation-modal-description"
                className="bounce-in-modal"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper elevation={5} sx={{ padding: '40px', borderRadius: '16px', maxWidth: '600px', width: '90%', textAlign: 'center' }}>
                    <WarningAmberIcon sx={{ fontSize: '70px', color: 'orange', mb: '30px' }} />
                    <Typography variant="h5" sx={{ mb: '20px', fontSize: '24px' }}>
                        Are you sure you want to delete this email?
          </Typography>
                    <Box display="flex" justifyContent="center" mt="35px" gap="20px">
                        <Button
                            onClick={handleCloseConfirmation}
                            sx={{ backgroundColor: '#9e9e9e', color: '#fff', '&:hover': { backgroundColor: '#757575' }, padding: '12px 24px', fontSize: '16px' }}
                        >
                            Cancel
            </Button>
                        <Button
                            onClick={handleDeleteConfirmation}
                            sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' }, padding: '12px 24px', fontSize: '16px' }}
                        >
                            Confirm
            </Button>
                    </Box>
                </Paper>
            </Modal>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#141b2d',
                        color: '#e0e0e0',
                        fontSize: '20px',
                        borderRadius: '8px',
                        minWidth: '500px',
                        textAlign: 'center',
                    },
                    '& .MuiSnackbarContent-message': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }
                }}
                message={(
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: '30px', marginRight: '10px' }} />
                        {snackbarMessage}
                    </span>
                )}
            />
        </Box>
    );
};

export default EmailList;
