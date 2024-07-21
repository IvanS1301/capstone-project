import React, { useState } from 'react'
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Snackbar, IconButton, Modal, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Visibility } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/** --- IMPORT CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- IMPORT TIME AND DATE FORMAT --- */
import moment from 'moment'

/** --- IMPORT REACT ROUTER --- */
import { Link } from 'react-router-dom';

const AgentEmailList = ({ emails, userlgs, onEmailDelete }) => {
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
                onEmailDelete();
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
            minWidth: 300,
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
            minWidth: 350,
        },
        {
            field: "text",
            headerName: "Text",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "userLG_id",
            headerName: "Submitted By",
            flex: 1,
            minWidth: 180,
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
            minWidth: 200,
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
                    List of Emails Sent
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
                        fontWeight: "600"
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
                        fontSize: "18px",
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
                        fontWeight: "800"
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
                    <div style={{ fontSize: '20px', margin: '20px 0' }}>Are you sure you want to delete this email?</div>
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

export default AgentEmailList;
