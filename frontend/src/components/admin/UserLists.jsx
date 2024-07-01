import React, { useState } from 'react'

/** --- MATERIAL UI --- */
import { Box, IconButton, Modal, CircularProgress, Button, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Visibility, Edit } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/** --- IMPORT CONTEXT --- */
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- IMPORT TIME AND DATE FORMAT --- */
import moment from 'moment'

/** --- FOR MODAL --- */
import EditUserInfo from '../../pages/profile/EditUserInfo';
import ReadUserInfo from '../../pages/profile/ReadUserInfo';

const UserLists = ({ userlgs, onUserUpdate }) => {
  const { dispatch } = useUsersContext();
  const { userLG } = useAuthContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false); // State for ViewLead modal

  /** --- FOR DELETE BUTTON --- */
  const [loadingDelete, setLoadingDelete] = useState(false); // State for delete loading
  const [errorDelete, setErrorDelete] = useState(null); // State for delete error
  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message

  const handleClick = async (userId) => {
    if (!userLG) {
      return;
    }
    setSelectedUserId(userId);
    setShowConfirmation(true);
  };

  const handleOpenUpdateModal = (userId) => {
    setSelectedUserId(userId);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedUserId(null);
  };

  const handleDeleteConfirmation = async () => {
    try {
      setLoadingDelete(true); // Start delete loading
      const response = await fetch(`http://localhost:4000/api/userLG/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${userLG.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_USER", payload: json });
        setSnackbarMessage("User Deleted Successfully!");
        setSnackbarOpen(true);
        onUserUpdate();
      }
    } catch (error) {
      setErrorDelete('Error deleting user.'); // Set delete error
      console.error('Error deleting user:', error);
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

  const handleOpenViewModal = (userId) => {
    setSelectedUserId(userId);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedUserId(null);
  };

  const iconButtonStyle = { color: "#111827" };

  // Custom rendering function for boolean values
  const renderBooleanCell = (params) => {
    return (
      <div className="flex items-center h-full ml-4">
        {params.value ? (
          <div className="w-3 h-3 rounded-full bg-green-800"></div> // Green circle for true
        ) : (
            <div className="w-3 h-3 rounded-full bg-red-500"></div> // Red circle for false
          )}
      </div>
    );
  };

  // Custom rendering function for status
  const renderStatusCell = (params) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Start Shift':
          return 'bg-emerald-700';
        case 'End Shift':
          return 'bg-red-500';
        case 'First Break':
          return 'bg-fuchsia-800';
        case 'Lunch':
          return 'bg-rose-700';
        case 'Team Meeting':
          return 'bg-stone-700';
        case 'Coaching':
          return 'bg-cyan-800';
        default:
          return 'none'; // Default color for unrecognized statuses
      }
    };

    const statusColorClass = getStatusColor(params.value);

    return (
      <div className="flex items-center h-full mr-3 mb-4">
        <div className={`flex items-center justify-center text-white rounded-full w-40 h-7 ${statusColorClass}`}>
          {params.value}
        </div>
      </div>
    );
  };

  // Custom rendering function for status
  const renderRoleCell = (params) => {
    const getRoleColor = (status) => {
      switch (status) {
        case 'Lead Generation':
          return 'bg-teal-800';
        case 'Telemarketer':
          return 'bg-blue-800';
        case 'Team Leader':
          return 'bg-rose-700';
        default:
          return 'none'; // Default color for unrecognized statuses
      }
    };

    const roleColorClass = getRoleColor(params.value);

    return (
      <div className="flex items-center h-full mr-3 mb-4">
        <div className={`flex items-center justify-center text-white rounded-full w-40 h-7 ${roleColorClass}`}>
          {params.value}
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: "_id",
      headerName: "Employee ID",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => params.value.slice(17, 26),
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 270,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 280,
      renderCell: renderRoleCell,
    },
    {
      field: "number",
      headerName: "Phone Number",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 1,
      minWidth: 50,
      renderCell: renderBooleanCell,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 200,
      renderCell: renderStatusCell,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const status = params.row.status;
        return status ? moment(params.row.updatedAt).startOf('minute').fromNow() : '';
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenViewModal(params.row._id)} style={iconButtonStyle}><Visibility /></IconButton>
          <IconButton onClick={() => handleClick(params.row._id)} style={iconButtonStyle}><Delete /></IconButton>
          <IconButton onClick={() => handleOpenUpdateModal(params.row._id)} style={iconButtonStyle}><Edit /></IconButton>
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
          Chromagen Staffs
            </Typography>
        <Typography variant="h5" color="#111827">
          List of Users
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
            fontSize: "18px",
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
          rows={userlgs}
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
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="assign-lead-modal-title"
        aria-describedby="assign-lead-modal-description"
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
          }}
        >
          {selectedUserId && <EditUserInfo userId={selectedUserId} onUserUpdate={onUserUpdate} />}
        </Box>
      </Modal>
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
              <div>{errorDelete || 'User Deleted Successfully!'}</div> // Show error or success message
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
          <div style={{ fontSize: '20px', margin: '20px 0' }}>Are you sure you want to delete this user?</div>
          <Button onClick={handleDeleteConfirmation} variant="contained" color="primary" sx={{ mr: 2 }}>Yes</Button>
          <Button onClick={handleCloseConfirmation} variant="contained" color="secondary">No</Button>
        </Box>
      </Modal>
      <Modal
        open={openViewModal}
        onClose={handleCloseViewModal}
        aria-labelledby="view-lead-modal-title"
        aria-describedby="view-lead-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80%',
            overflow: 'auto',
          }}
        >
          {selectedUserId && <ReadUserInfo userId={selectedUserId} />}
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

export default UserLists;
