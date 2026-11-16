import { useState, useEffect } from 'react';
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
import { useLeadsContext } from "../../hooks/useLeadsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const AgentUpdateForm = ({ unassignedId, onLeadUpdate }) => {

    const { unassignedLeads, dispatch } = useLeadsContext();
    const { userLG } = useAuthContext();

    const [leadData, setLeadData] = useState({
        name: '',
        type: '',
        phonenumber: '',
        streetaddress: '',
        city: '',
        postcode: '',
        emailaddress: '',
        callDisposition: '',
        remarks: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    // ==========================================
    // FETCH EXISTING LEAD DETAILS
    // ==========================================

    useEffect(() => {

        const lead = unassignedLeads.find(
            lead => lead._id === unassignedId
        );

        if (lead) {

            setLeadData({
                name: lead.name || '',
                type: lead.type || '',
                phonenumber: lead.phonenumber || '',
                streetaddress: lead.streetaddress || '',
                city: lead.city || '',
                postcode: lead.postcode || '',
                emailaddress: lead.emailaddress || '',
                callDisposition: lead.callDisposition || '',
                remarks: lead.remarks || ''
            });

        }

    }, [unassignedId, unassignedLeads]);

    // ==========================================
    // HANDLE GENERAL INPUT CHANGES
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
    // HANDLE NUMERIC INPUT CHANGES
    // ==========================================

    const handleNumericChange = (e) => {

        const { name, value } = e.target;

        // Remove spaces, letters, and special characters
        const numericValue = value.replace(/\D/g, '');

        setLeadData(prevData => ({
            ...prevData,
            [name]: numericValue
        }));

        setError(null);

    };

    // ==========================================
    // HANDLE FORM SUBMISSION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        setError(null);

        // ==========================================
        // REQUIRED FIELD VALIDATION
        // ==========================================

        const requiredFields = {
            name: 'Lead Name',
            type: 'Type',
            phonenumber: 'Phone Number',
            streetaddress: 'Street Address',
            city: 'City',
            postcode: 'Postcode',
            emailaddress: 'Email Address',
            callDisposition: 'Call Disposition',
            remarks: 'Remarks'
        };

        const emptyFields = Object.entries(requiredFields)
            .filter(([field]) =>
                !String(leadData[field] || '').trim()
            )
            .map(([, label]) => label);

        if (emptyFields.length > 0) {

            setError(
                `Please complete the following required fields: ${emptyFields.join(', ')}. Empty or space-only entries are not allowed.`
            );

            return;
        }

        // ==========================================
        // NORMALIZE PHONE NUMBER AND POSTCODE
        // ==========================================

        const cleanedPhone = leadData.phonenumber.replace(/\D/g, '');
        const cleanedPostcode = leadData.postcode.replace(/\D/g, '');

        // ==========================================
        // AUSTRALIAN PHONE NUMBER VALIDATION
        // ==========================================

        const phoneRegex =
            /^(?:04\d{8}|0[2378]\d{8}|13\d{4}|1[38]00\d{6}|614\d{8}|61[2378]\d{8})$/;

        if (!phoneRegex.test(cleanedPhone)) {

            setError(
                'Enter a valid Australian phone number. Examples: 0412345678, 0255504321, 1300975707, or 61412345678.'
            );

            return;
        }

        // ==========================================
        // AUSTRALIAN POSTCODE VALIDATION
        // ==========================================

        const postcodeRegex = /^\d+$/;

        if (!postcodeRegex.test(cleanedPostcode)) {

            setError(
                'Postcode must contain numbers only.'
            );

            return;
        }

        // ==========================================
        // EMAIL ADDRESS FORMAT VALIDATION
        // ==========================================

        const email = leadData.emailaddress.trim().toLowerCase();

        const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {

            setError(
                'Please enter a valid email address (e.g., name@example.com.au).'
            );

            return;
        }

        // ==========================================
        // COMMON MISSPELLED EMAIL DOMAIN VALIDATION
        // ==========================================

        const commonDomainTypos = {

            // Gmail
            'gma.com': 'gmail.com',
            'gmil.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmial.com': 'gmail.com',
            'gmail.con': 'gmail.com',
            'gmail.co': 'gmail.com',

            // Yahoo
            'yaho.com': 'yahoo.com',
            'yahoo.con': 'yahoo.com',
            'yahoo.co': 'yahoo.com',

            // Hotmail
            'hotmial.com': 'hotmail.com',
            'hotmai.com': 'hotmail.com',
            'hotmail.con': 'hotmail.com',

            // Outlook
            'outlok.com': 'outlook.com',
            'outlook.con': 'outlook.com',
            'outllok.com': 'outlook.com',

            // iCloud
            'iclould.com': 'icloud.com',
            'icloud.con': 'icloud.com'

        };

        const domain = email.split('@')[1];

        if (commonDomainTypos[domain]) {

            setError(
                `Incorrect email domain. Did you mean ${commonDomainTypos[domain]}? Please check your email address.`
            );

            return;
        }

        // ==========================================
        // PREPARE UPDATED LEAD DATA
        // ==========================================

        const updatedLeadData = {
            ...leadData,
            phonenumber: cleanedPhone,
            postcode: cleanedPostcode,
            emailaddress: email
        };

        setLoading(true);

        try {

            // ==========================================
            // CHECK USER AUTHENTICATION
            // ==========================================

            if (!userLG || !userLG.token) {

                setError('You must be logged in.');

                return;
            }

            // ==========================================
            // SEND UPDATED LEAD DATA TO BACKEND
            // ==========================================

            const response = await fetch(
                `${URL}/api/leads/${unassignedId}`,
                {
                    method: 'PATCH',

                    body: JSON.stringify(updatedLeadData),

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userLG.token}`
                    }
                }
            );

            // ==========================================
            // READ SERVER RESPONSE
            // ==========================================

            const json = await response.json();

            if (!response.ok) {

                setError(
                    json.error || 'Failed to update lead. Please try again.'
                );

                return;
            }

            // ==========================================
            // SUCCESSFUL LEAD UPDATE
            // ==========================================

            setError(null);

            setOpenSuccessModal(true);

            // Update the lead in the local state
            dispatch({
                type: 'UPDATE_STATUS',
                payload: json
            });

            // Close modal and execute onLeadUpdate after 2 seconds
            setTimeout(() => {

                setOpenSuccessModal(false);

                onLeadUpdate();

            }, 2000);

        } catch (err) {

            console.error('Lead update error:', err);

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
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 900,
                bgcolor: '#f1f1f1',
                border: '2px solid #000',
                boxShadow: 24,
                p: 5,
                borderRadius: '30px'
            }}
        >

            <form onSubmit={handleSubmit}>

                <div className="text-[#D22B2B] text-2xl mb-3 font-medium">
                    Update Lead
                </div>

                <Grid container spacing={2}>

                    {/* LEAD NAME */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Lead Name"
                            name="name"
                            value={leadData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                    </Grid>

                    {/* TYPE */}

                    <Grid item xs={12} sm={6}>

                        <FormControl fullWidth margin="normal" required>

                            <InputLabel id="type-label">
                                Type
                            </InputLabel>

                            <Select
                                labelId="type-label"
                                name="type"
                                value={leadData.type}
                                onChange={handleChange}
                                label="Type"
                                required
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

                    <Grid item xs={12} sm={6}>

                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phonenumber"
                            type="text"
                            value={leadData.phonenumber}
                            onChange={handleNumericChange}
                            margin="normal"
                            required
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                maxLength: 11
                            }}
                            helperText="Australian formats: 04XXXXXXXX, 0[2,3,7,8]XXXXXXXX, 13XXXX, 1300XXXXXX, 1800XXXXXX, or 61XXXXXXXXX"
                        />

                    </Grid>

                    {/* STREET ADDRESS */}

                    <Grid item xs={12} sm={6}>

                        <TextField
                            fullWidth
                            label="Street Address"
                            name="streetaddress"
                            value={leadData.streetaddress}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />

                    </Grid>

                    {/* CITY */}

                    <Grid item xs={12} sm={6}>

                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={leadData.city}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />

                    </Grid>

                    {/* POSTCODE */}

                    <Grid item xs={12} sm={6}>

                        <TextField
                            fullWidth
                            label="Postcode"
                            name="postcode"
                            type="text"
                            value={leadData.postcode}
                            onChange={handleNumericChange}
                            margin="normal"
                            required
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*'
                            }}
                            helperText="Numbers only"
                        />

                    </Grid>

                    {/* EMAIL ADDRESS */}

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            label="Email Address"
                            name="emailaddress"
                            value={leadData.emailaddress}
                            onChange={handleChange}
                            margin="normal"
                            type="email"
                            required
                            helperText="Example: name@example.com.au. Check the spelling of the email domain."
                        />

                    </Grid>

                    {/* CALL DISPOSITION */}

                    <Grid item xs={12}>

                        <FormControl fullWidth margin="normal" required>

                            <InputLabel id="callDispo-label">
                                Call Disposition
                            </InputLabel>

                            <Select
                                labelId="callDispo-label"
                                name="callDisposition"
                                value={leadData.callDisposition}
                                onChange={handleChange}
                                label="Call Disposition"
                                required
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

                                <MenuItem value="Not Eligible">Not Eligible</MenuItem>
                                <MenuItem value="Already Installed">Already Installed</MenuItem>
                                <MenuItem value="Wrong/Not Working">Wrong/Not Working</MenuItem>
                                <MenuItem value="Booked">Booked</MenuItem>
                                <MenuItem value="Residential">Residential</MenuItem>
                                <MenuItem value="Callback">Callback</MenuItem>
                                <MenuItem value="Do Not Call">Do Not Call</MenuItem>
                                <MenuItem value="No Answer">No Answer</MenuItem>
                                <MenuItem value="Not Interested">Not Interested</MenuItem>
                                <MenuItem value="Voicemail">Voicemail</MenuItem>
                                <MenuItem value="Warm Lead">Warm Lead</MenuItem>
                                <MenuItem value="Email">Email</MenuItem>

                            </Select>

                        </FormControl>

                    </Grid>

                    {/* REMARKS */}

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Remarks"
                            name="remarks"
                            value={leadData.remarks}
                            onChange={handleChange}
                            placeholder="Describe how your call went.."
                            margin="normal"
                            required
                            InputProps={{
                                sx: {
                                    padding: 4
                                }
                            }}
                        />

                    </Grid>

                </Grid>

                {/* SUBMIT BUTTON */}

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
                            ? <CircularProgress size={24} sx={{ color: '#fff' }} />
                            : "Update"
                        }

                    </Button>

                </Box>

                {/* ERROR MESSAGE */}

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

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

                    <div style={{ fontSize: '20px', marginTop: '10px' }}>
                        Updating, please wait...
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

                    <CheckCircleIcon
                        sx={{
                            color: '#94e2cd',
                            fontSize: 60
                        }}
                    />

                    <div style={{ fontSize: '20px', marginTop: '10px' }}>
                        Update Successfully!
                    </div>

                </Box>

            </Modal>

        </Box>
    );
};

export default AgentUpdateForm;
