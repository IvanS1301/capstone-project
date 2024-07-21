import React, { useState } from 'react';

/** --- MATERIAL UI --- */
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Visibility, Edit, Call as CallIcon } from '@mui/icons-material';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';

/** --- IMPORT TIME AND DATE FORMAT --- */
import moment from 'moment';

/** --- FOR MODAL --- */
import AgentEditForm from '../../pages/agent/AgentEditForm';
import AgentReadForm from '../../pages/agent/AgentReadForm';
import AddEmail from '../../pages/agent/AddEmail';

const AgentLeadDetails = ({ unassignedLeads, userlgs, onLeadUpdate }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [emailaddress, setEmailAddress] = useState('');

  const handleOpenAssignModal = (unassignedId) => {
    setSelectedLeadId(unassignedId);
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedLeadId(null);
  };

  const handleOpenViewModal = (unassignedId) => {
    setSelectedLeadId(unassignedId);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedLeadId(null);
  };

  const handleOpenEmailModal = (unassignedId, email) => {
    setSelectedLeadId(unassignedId);
    setEmailAddress(email);
    setOpenEmailModal(true);
  };

  const handleCloseEmailModal = () => {
    setOpenEmailModal(false);
    setEmailAddress('');
    setSelectedLeadId(null);
  };

  const iconButtonStyle = { color: "#111827" };

  // Custom rendering function for status
  const renderStatusCell = (params) => {
    const getStatusColor = (callDisposition) => {
      switch (callDisposition) {
        case 'Booked':
          return { backgroundColor: '#065f46', color: 'white' };
        case 'Warm Lead':
          return { backgroundColor: '#7f1d1d', color: 'white' };
        case 'Email':
          return { backgroundColor: '#164e63', color: 'white' };
        default:
          return { color: '#0c0a09' };
      }
    };

    const statusStyle = getStatusColor(params.value);

    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', marginRight: '12px', marginBottom: '16px' }}>
        <div style={{ ...statusStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', width: '160px', height: '28px' }}>
          {params.value}
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 280,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "emailaddress",
      headerName: "Email",
      flex: 1,
      minWidth: 320,
    },
    {
      field: "callDisposition",
      headerName: "Call Disposition",
      flex: 1,
      minWidth: 220,
      renderCell: renderStatusCell,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      minWidth: 220,
      cellClassName: "name-column--cell",
    },
    {
      field: "Distributed",
      headerName: "Distributed",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        moment(params.row.Distributed).startOf('minute').fromNow()
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenViewModal(params.row._id)} style={iconButtonStyle}><Visibility /></IconButton>
          <IconButton onClick={() => handleOpenAssignModal(params.row._id)} style={iconButtonStyle}><Edit /></IconButton>
          <IconButton href={`skype:${params.row.phonenumber}?call`} style={iconButtonStyle}><CallIcon /></IconButton>
          <IconButton onClick={() => handleOpenEmailModal(params.row._id, params.row.emailaddress)} style={iconButtonStyle}><AttachEmailIcon /></IconButton>
        </Box>
      )
    },
  ];

  // Filter out rows where callDisposition is 'Do Not Call'
  const filteredLeads = unassignedLeads.filter(lead => lead.callDisposition !== 'Do Not Call');

  return (
    <Box m="20px">
      <Box mb="20px">
        <Typography
          variant="h4"
          color="#111827"
          fontWeight="bold"
          sx={{ m: "0 0 5px 0", mt: "25px" }}
        >
          ASSIGNED LEADS
        </Typography>
        <Typography variant="h5" color="#111827">
          List of Assigned Leads
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
            color: "#ffffff !important",
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
            color: "#ffffff !important",
          },
          "& .MuiTablePagination-actions .MuiButtonBase-root": {
            color: "#ffffff !important",
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
          rows={filteredLeads}
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
          {selectedLeadId && <AgentEditForm unassignedId={selectedLeadId} onLeadUpdate={onLeadUpdate} />}
        </Box>
      </Modal>

      <Modal
        open={openEmailModal}
        onClose={handleCloseEmailModal}
        aria-labelledby="email-lead-modal-title"
        aria-describedby="email-lead-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 900,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 5,
          }}
        >
          {selectedLeadId && <AddEmail email={emailaddress} onLeadUpdate={onLeadUpdate} />}
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
          {selectedLeadId && <AgentReadForm unassignedId={selectedLeadId} />}
        </Box>
      </Modal>
    </Box>
  );
};

export default AgentLeadDetails;
