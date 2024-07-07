import { useState, useEffect } from 'react'
import { URL } from "../../utils/URL";
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from '../../hooks/useAuthContext'
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Modal } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from 'moment'; // Import moment for date handling

const UpdateUserAG = ({ userId, onUserUpdate }) => {
  const { userlgs, dispatch } = useUsersContext()
  const { userLG } = useAuthContext()

  const [userData, setUserData] = useState({
    birthday: '',
    number: '',
    homeaddress: '',
    gender: ''
  })
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null)
  const [openSuccessModal, setOpenSuccessModal] = useState(false); // State for success modal

  useEffect(() => {
    // Fetch the user details based on the ID
    const userlg = userlgs.find(userlg => userlg._id === userId)
    if (userlg) {
      setUserData({
        birthday: userlg.birthday ? moment(userlg.birthday).format('YYYY-MM-DD') : '', // Format the date
        number: userlg.number || '',
        homeaddress: userlg.homeaddress || '',
        gender: userlg.gender || ''
      })
    }
  }, [userId, userlgs])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); // Start loading

    // Send the updated user data to the backend for updating
    const response = await fetch(`${URL}/api/userLG/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userLG.token}`
      }
    })
    const json = await response.json()

    setLoading(false); // Stop loading

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setOpenSuccessModal(true);
      // Update the user in the local state
      dispatch({ type: 'UPDATE_USER', payload: json })
      // Delay the execution of onUserUpdate to show the modal first
      setTimeout(() => {
        setOpenSuccessModal(false);
        onUserUpdate();
      }, 2000); // 2 seconds delay
    }
  }

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
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
        borderRadius: '30px'
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Update Profile</div>
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
            label="Gender"
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
        {error && <div className="error">{error}</div>}
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
          <div style={{ fontSize: '20px', marginTop: '10px' }}>Update Successfully!</div>
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateUserAG;
