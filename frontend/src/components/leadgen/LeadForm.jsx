import { useState } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Modal,
  Grid
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXT --- */
import { useLeadgenContext } from "../../hooks/useLeadgenContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const LeadForm = () => {

  const { dispatch } = useLeadgenContext();
  const { userLG } = useAuthContext();

  const initialLeadData = {
    name: '',
    type: '',
    phonenumber: '',
    streetaddress: '',
    city: '',
    postcode: '',
    emailaddress: ''
  };

  const [leadData, setLeadData] = useState(initialLeadData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }));

    setError(null);
  };

  // ==========================================
  // HANDLE FORM SUBMISSION
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);
    setEmptyFields([]);

    try {

      // ==========================================
      // CHECK USER AUTHENTICATION
      // ==========================================

      if (!userLG || !userLG.token) {
        setError('You must be logged in.');
        return;
      }

      // ==========================================
      // SUBMIT NEW LEAD TO BACKEND
      // ==========================================

      const response = await fetch(`${URL}/api/leads`, {
        method: 'POST',

        body: JSON.stringify(leadData),

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userLG.token}`
        }
      });

      // ==========================================
      // READ SERVER RESPONSE
      // ==========================================

      const json = await response.json();

      if (!response.ok) {

        setError(
          json.error || 'Failed to create lead. Please try again.'
        );

        setEmptyFields(json.emptyFields || []);

        return;
      }

      // ==========================================
      // SUCCESSFUL LEAD CREATION
      // ==========================================

      setError(null);
      setLeadData(initialLeadData);
      setEmptyFields([]);

      dispatch({
        type: 'CREATE_LEAD',
        payload: json
      });

      setOpenSuccessModal(true);

    } catch (err) {

      console.error('Lead creation error:', err);

      setError(
        'Unable to connect to the server. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // CLOSE SUCCESS MODAL
  // ==========================================

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  // ==========================================
  // COMPONENT UI
  // ==========================================

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

        <div className="text-[#D22B2B] text-2xl mb-3 font-medium">
          Add New Lead
        </div>

        <Grid container spacing={2}>

          {/* NAME */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Name"
              name="name"
              value={leadData.name}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('name')}
            />
          </Grid>

          {/* TYPE */}

          <Grid item xs={12}>
            <FormControl
              fullWidth
              required
              margin="normal"
              error={emptyFields.includes('type')}
            >

              <InputLabel id="type-label">
                Type
              </InputLabel>

              <Select
                labelId="type-label"
                name="type"
                value={leadData.type}
                onChange={handleChange}
                label="Type"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 240,
                      width: 250
                    }
                  }
                }}
              >

                <MenuItem value="">
                  <em>Choose One</em>
                </MenuItem>

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

          {/* PHONE NUMBER */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phonenumber"
              value={leadData.phonenumber}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('phonenumber')}
            />
          </Grid>

          {/* STREET ADDRESS */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Street Address"
              name="streetaddress"
              value={leadData.streetaddress}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('streetaddress')}
            />
          </Grid>

          {/* CITY */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="City"
              name="city"
              value={leadData.city}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('city')}
            />
          </Grid>

          {/* POSTCODE */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Postcode"
              name="postcode"
              value={leadData.postcode}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('postcode')}
            />
          </Grid>

          {/* EMAIL ADDRESS */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Email Address"
              name="emailaddress"
              type="email"
              value={leadData.emailaddress}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('emailaddress')}
            />
          </Grid>

          {/* SUBMIT BUTTON */}

          <Grid item xs={12}>

            <Box mt={2}>

              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: '#3e4396'
                }}
              >

                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : "Submit"
                }

              </Button>

            </Box>

          </Grid>

          {/* ERROR MESSAGE */}

          {error && (

            <Grid item xs={12}>
              <div className="error">
                {error}
              </div>
            </Grid>

          )}

        </Grid>

      </form>

      {/* ==========================================
          LOADING MODAL
      ========================================== */}

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

          <div
            style={{
              fontSize: '20px',
              marginTop: '10px'
            }}
          >
            Saving, please wait...
          </div>

        </Box>

      </Modal>

      {/* ==========================================
          SUCCESS MODAL
      ========================================== */}

      <Modal
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        className="bounce-in-modal"
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

          <CheckCircleIcon
            sx={{
              color: '#94e2cd',
              fontSize: 60
            }}
          />

          <div
            style={{
              fontSize: '20px',
              marginTop: '10px'
            }}
          >
            New lead added!
          </div>

        </Box>

      </Modal>

    </Box>
  );
};

export default LeadForm;
