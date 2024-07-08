import { useState, useEffect } from 'react';
import { useLeadsContext } from "../../hooks/useLeadsContext";
import { useAuthContext } from '../../hooks/useAuthContext';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Modal, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AssignLead = ({ userlgs, leadId, onLeadUpdate }) => {
  const { tlLeads, dispatch } = useLeadsContext();
  const { userLG } = useAuthContext();

  const [leadData, setLeadData] = useState({
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false); // State for success modal

  useEffect(() => {
    // Fetch the lead details based on the ID
    const lead = tlLeads.find(lead => lead._id === leadId);
    if (lead) {
      setLeadData({
        assignedTo: lead.assignedTo || ''
      });
    }
  }, [leadId, tlLeads]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Send the updated lead data to the backend for updating
    const response = await fetch(`${URL}/api/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(leadData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userLG.token}`
      }
    });
    const json = await response.json();

    setLoading(false); // Stop loading

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setOpenSuccessModal(true);
      // Update the lead in the local state
      dispatch({ type: 'UPDATE_TL_LEAD', payload: json });
      // Delay the execution of onUserUpdate to show the modal first
      setTimeout(() => {
        setOpenSuccessModal(false);
        onLeadUpdate();
      }, 2000); // 2 seconds delay
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  // Filter userlgs to only include telemarketers
  const telemarketers = userlgs.filter(userlg => userlg.role === 'Telemarketer');

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 6,
        borderRadius: '30px'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Assign Lead</div>
        <div>
          <FormControl fullWidth>
            <InputLabel id="assignedTo-label">Assign To:</InputLabel>
            <Select
              labelId="assignedTo-label"
              id="assignedTo"
              name="assignedTo"
              value={leadData.assignedTo}
              onChange={handleChange}
              label="Assign To"
              MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 240, // Adjust the maximum height
                        width: 250 // Adjust the width
                    }
                }
            }}
              required
            >
              <MenuItem value="">
                <em>Select User</em>
              </MenuItem>
              {telemarketers && telemarketers.map((userlg) => (
                <MenuItem key={userlg._id} value={userlg._id}>
                  {userlg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <Button variant="contained" type="submit" disabled={loading} sx={{ backgroundColor: '#3e4396' }}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
          {error && <div className="error">{error}</div>}
        </div>
      </form>

      <Modal
        open={loading}
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
          <div style={{ fontSize: '20px', marginTop: '10px' }}>Sending, please wait...</div>
        </Box>
      </Modal>

      <Modal
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
          <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 60 }} />
          <div style={{ fontSize: '20px', marginTop: '10px' }}>Assigned Successfully!</div>
        </Box>
      </Modal>
    </Box>
  );
};

export default AssignLead;
