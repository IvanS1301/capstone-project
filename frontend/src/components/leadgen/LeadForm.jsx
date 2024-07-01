import { useState } from 'react';

/** --- MATERIAL UI --- */
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Modal, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXT --- */
import { useLeadgenContext } from "../../hooks/useLeadgenContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const LeadForm = () => {
  const { dispatch } = useLeadgenContext();
  const { userLG } = useAuthContext();

  const [leadData, setLeadData] = useState({
    name: '',
    type: '',
    phonenumber: '',
    streetaddress: '',
    city: '',
    postcode: '',
    emailaddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userLG) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    const response = await fetch('http://localhost:4000/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userLG.token}`
      }
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    } else {
      setError(null);
      setLeadData({
        name: '',
        type: '',
        phonenumber: '',
        streetaddress: '',
        city: '',
        postcode: '',
        emailaddress: ''
      });
      setEmptyFields([]);
      setOpenSuccessModal(true);
      dispatch({ type: 'CREATE_LEAD', payload: json });
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '55%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: '#f1f1f1',
        border: '2px solid #f1f1f1',
        boxShadow: 24,
        p: 6,
        borderRadius: '30px'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Add New Lead</div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={leadData.name}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" error={emptyFields.includes('type')}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={leadData.type}
                onChange={handleChange}
              >
                <MenuItem value=""><em>Choose One</em></MenuItem>
                <MenuItem value="Warehouse">Warehouse</MenuItem>
                <MenuItem value="Restaurant">Restaurant</MenuItem>
                <MenuItem value="Boutiques">Boutiques</MenuItem>
                <MenuItem value="Salon">Salon</MenuItem>
                <MenuItem value="Spa">Spa</MenuItem>
                <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Gym">Gym</MenuItem>
                <MenuItem value="Automotive">Automotive</MenuItem>
                <MenuItem value="Cafe">Cafe</MenuItem>
                <MenuItem value="Brewery">Brewery</MenuItem>
                <MenuItem value="Pet Shops">Pet Shops</MenuItem>
                <MenuItem value="Laundry">Laundry</MenuItem>
                <MenuItem value="Clinic">Clinic</MenuItem>
                <MenuItem value="Garages">Garages</MenuItem>
                <MenuItem value="Mechanics">Mechanics</MenuItem>
                <MenuItem value="Butchery">Butchery</MenuItem>
                <MenuItem value="Agricultural">Agricultural</MenuItem>
                <MenuItem value="Schools">Schools</MenuItem>
                <MenuItem value="Convenience Store">Convenience Store</MenuItem>
                <MenuItem value="Business Consultant">Business Consultant</MenuItem>
                <MenuItem value="Financing">Financing</MenuItem>
                <MenuItem value="Publishing">Publishing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phonenumber"
              value={leadData.phonenumber}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('phonenumber')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              name="streetaddress"
              value={leadData.streetaddress}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('streetaddress')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={leadData.city}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('city')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Postcode"
              name="postcode"
              value={leadData.postcode}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('postcode')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="emailaddress"
              value={leadData.emailaddress}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('emailaddress')}
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#3e4396' }}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Box>
          </Grid>
          {error && <Grid item xs={12}><div className="error">{error}</div></Grid>}
        </Grid>
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
            left: '55%',
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
          <div style={{ fontSize: '20px', marginTop: '10px' }}>Saving, please wait...</div>
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
            left: '55%',
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
          <div style={{ fontSize: '20px', marginTop: '10px' }}>New lead added!</div>
        </Box>
      </Modal>
    </Box>
  );
};

export default LeadForm;
