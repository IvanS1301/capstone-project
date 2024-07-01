import React, { useState } from 'react';

/** --- MATERIAL UI --- */
import { Box, IconButton, Modal, CircularProgress, Button, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Visibility } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/** --- IMPORT CONTEXT --- */
import { useLeadsContext } from "../../hooks/useLeadsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- IMPORT TIME AND DATE FORMAT --- */
import moment from 'moment';

/** --- FOR MODAL --- */
import AssignPage from '../../pages/admin/AssignPage';
import ReadLead from '../../pages/admin/ReadLead';

const LeadList = ({ tlLeads, userlgs, onLeadUpdate }) => {
  const { dispatch } = useLeadsContext();
  const { userLG } = useAuthContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false); // State for ViewLead modal

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

  const handleClick = async (leadId) => {
    if (!userLG) {
      return;
    }
    setSelectedLeadId(leadId);
    setShowConfirmation(true);
  };

  const handleOpenAssignModal = (leadId) => {
    setSelectedLeadId(leadId);
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedLeadId(null);
  };

  const handleDeleteConfirmation = async () => {
    try {
      setLoadingDelete(true); // Start delete loading
      const response = await fetch(`/api/leads/${selectedLeadId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${userLG.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_TL_LEAD", payload: json });
        setSnackbarMessage("Lead Deleted Successfully!");
        setSnackbarOpen(true);
        onLeadUpdate();
      }
    } catch (error) {
      setErrorDelete('Error deleting lead.'); // Set delete error
      console.error('Error deleting lead:', error);
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

  const handleOpenViewModal = (leadId) => {
    setSelectedLeadId(leadId);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedLeadId(null);
  };

  const iconButtonStyle = { color: "#111827" };

  // Custom rendering function for status
  const renderStatusCell = (params) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Booked':
          return 'bg-emerald-700';
        case 'Warm Lead':
          return 'bg-rose-700';
        case 'Email':
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

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => params.value.slice(20, 26),
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 230,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "emailaddress",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "userLG_id",
      headerName: "Lead By",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => userIdToNameMap[params.value] || params.value,
    },
    {
      field: "callDisposition",
      headerName: "Call Disposition",
      flex: 1,
      minWidth: 200,
      renderCell: renderStatusCell,
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => userIdToNameMap[params.value] || params.value,
    },
    {
      field: "Distributed",
      headerName: "Distributed",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const assignedTo = params.row.assignedTo;
        return assignedTo ? moment(params.row.Distributed).startOf('minute').fromNow() : '';
      }
    },
    {
      field: "updatedAt",
      headerName: "Last Touch",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const callDisposition = params.row.callDisposition;
        return callDisposition ? moment(params.row.updatedAt).startOf('minute').fromNow() : '';
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 190,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenViewModal(params.row._id)} style={iconButtonStyle}><Visibility /></IconButton>
          <IconButton onClick={() => handleClick(params.row._id)} style={iconButtonStyle}><Delete /></IconButton>
          <IconButton onClick={() => handleOpenAssignModal(params.row._id)} style={iconButtonStyle}><PersonAddAlt1Icon /></IconButton>
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
          LEADS
            </Typography>
        <Typography variant="h5" color="#111827">
          List of Leads
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
          rows={tlLeads}
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
        open={openAssignModal}
        onClose={handleCloseAssignModal}
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
          {selectedLeadId && <AssignPage leadId={selectedLeadId} onLeadUpdate={onLeadUpdate} />}
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
              <div>{errorDelete || 'Lead Deleted Successfully!'}</div> // Show error or success message
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
          <div style={{ fontSize: '20px', margin: '20px 0' }}>Are you sure you want to delete this lead?</div>
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
          {selectedLeadId && <ReadLead leadId={selectedLeadId} />}
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

export default LeadList;