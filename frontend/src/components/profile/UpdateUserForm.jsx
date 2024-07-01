import { useState, useEffect } from 'react';
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from '../../hooks/useAuthContext';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Modal, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from 'moment';

const UpdateUserForm = ({ userId, onUserUpdate }) => {
  const { userlgs, dispatch } = useUsersContext();
  const { userLG } = useAuthContext();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    birthday: '',
    number: '',
    homeaddress: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    const userlg = userlgs.find(userlg => userlg._id === userId);
    if (userlg) {
      setUserData({
        name: userlg.name || '',
        email: userlg.email || '',
        role: userlg.role || '',
        birthday: userlg.birthday ? moment(userlg.birthday).format('YYYY-MM-DD') : '',
        number: userlg.number || '',
        homeaddress: userlg.homeaddress || '',
        gender: userlg.gender || ''
      });
    }
  }, [userId, userlgs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/userLG/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userLG.token}`
        }
      });

      const json = await response.json();

      setLoading(false);

      if (!response.ok) {
        setError(json.error);
      } else {
        setError(null);
        setOpenSuccessModal(true);
        dispatch({ type: 'UPDATE_USER', payload: json });
        // Delay the execution of onUserUpdate to show the modal first
        setTimeout(() => {
          setOpenSuccessModal(false);
          onUserUpdate();
        }, 2000); // 2 seconds delay
      }
    } catch (error) {
      setLoading(false);
      setError('Something went wrong');
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: '#f1f1f1',
        border: '2px solid #000',
        boxShadow: 24,
        p: 5,
        borderRadius: '30px'
      }}
    >
      <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Update Profile</div>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={userData.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          name="role"
          value={userData.role}
          onChange={handleChange}
        >
          <MenuItem value=""><em>Choose One</em></MenuItem>
          <MenuItem value="Lead Generation">Lead Generation</MenuItem>
          <MenuItem value="Telemarketer">Telemarketer</MenuItem>
          <MenuItem value="Team Leader">Team Leader</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Birthday"
        type="date"
        name="birthday"
        value={userData.birthday}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="number"
        value={userData.number}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Home Address"
        name="homeaddress"
        value={userData.homeaddress}
        onChange={handleChange}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          name="gender"
          value={userData.gender}
          onChange={handleChange}
        >
          <MenuItem value=""><em>Choose One</em></MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
      <Box mt={2}>
        <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#3e4396' }}>
          {loading ? <CircularProgress size={24} /> : "Update Profile"}
        </Button>
      </Box>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
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
          <div style={{ fontSize: '20px', marginTop: '10px' }}>Updating, please wait...</div>
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
          <div style={{ fontSize: '20px', marginTop: '10px' }}>Updated Successfully!</div>
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateUserForm;