import { useState, useEffect } from 'react';
import { URL } from "../../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Modal } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXTT --- */
import { useLeadgenContext } from "../../hooks/useLeadgenContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const UpdateLeadForm = ({ leadId, onLeadUpdate }) => {
    const { leads, dispatch } = useLeadgenContext();
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
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    useEffect(() => {
        // Fetch the lead details based on the ID
        const lead = leads.find(lead => lead._id === leadId);
        if (lead) {
            setLeadData({
                name: lead.name || '',
                type: lead.type || '',
                phonenumber: lead.phonenumber || '',
                streetaddress: lead.streetaddress || '',
                city: lead.city || '',
                postcode: lead.postcode || '',
                emailaddress: lead.emailaddress || ''
            });
        }
    }, [leadId, leads]);

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
            dispatch({ type: 'UPDATE_LEAD', payload: json });
            // Delay the execution of onLeadUpdate to show the modal first
            setTimeout(() => {
                setOpenSuccessModal(false);
                onLeadUpdate();
            }, 2000); // 2 seconds delay
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
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                bgcolor: '#f1f1f1',
                border: '2px solid #f1f1f1',
                boxShadow: 24,
                p: 5,
                borderRadius: '30px'
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Edit Lead</div>
                <TextField
                    fullWidth
                    label="Business Name"
                    name="name"
                    value={leadData.name}
                    onChange={handleChange}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
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
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phonenumber"
                    value={leadData.phonenumber}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Street Address"
                    name="streetaddress"
                    value={leadData.streetaddress}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={leadData.city}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Postcode"
                    name="postcode"
                    value={leadData.postcode}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email Address"
                    name="emailaddress"
                    value={leadData.emailaddress}
                    onChange={handleChange}
                    margin="normal"
                />
                <Box mt={2}>
                    <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#3e4396' }}>
                        {loading ? <CircularProgress size={24} sx={{ backgroundColor: '#white' }} /> : "Update"}
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

export default UpdateLeadForm;
