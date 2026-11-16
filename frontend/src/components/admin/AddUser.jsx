import React, { useState } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    Modal,
    CircularProgress
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

/** --- IMPORT CONTEXT --- */
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** ==========================================
    EMAIL VALIDATION HELPERS
========================================== */

// Common misspelled email domains
const commonDomainTypos = {
    'gma.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gnail.co': 'gmail.com',
    'gnail.com': 'gmail.com',

    'yaho.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'yahoo.co': 'yahoo.com',

    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',

    'outlok.com': 'outlook.com',
    'outlook.con': 'outlook.com',
    'outllok.com': 'outlook.com',

    'iclould.com': 'icloud.com',
    'icloud.con': 'icloud.com'
};

// General email format validation
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Check common misspelled domains
const getDomainSuggestion = (email) => {
    const domain = email.trim().toLowerCase().split('@')[1];

    return commonDomainTypos[domain] || null;
};

const AddUser = () => {

    const { dispatch } = useUsersContext();
    const { userLG } = useAuthContext();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    /** --- USER INFO --- */
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    // ==========================================
    // HANDLE FORM SUBMISSION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        setError(null);

        // ==========================================
        // CHECK AUTHENTICATION
        // ==========================================

        if (!userLG || !userLG.token) {

            setError('You must be logged in.');

            return;
        }

        // ==========================================
        // REQUIRED FIELD VALIDATION
        // ==========================================

        if (!name.trim()) {

            setError('Full Name is required. Empty or space-only entries are not allowed.');

            return;
        }

        if (!email.trim()) {

            setError('Email is required. Empty or space-only entries are not allowed.');

            return;
        }

        if (!password.trim()) {

            setError('Password is required. Empty or space-only entries are not allowed.');

            return;
        }

        if (!role.trim()) {

            setError('Please select a role.');

            return;
        }

        // ==========================================
        // CLEAN INPUT VALUES
        // ==========================================

        const cleanedName = name.trim();
        const cleanedEmail = email.trim().toLowerCase();

        // ==========================================
        // EMAIL FORMAT VALIDATION
        // ==========================================

        if (!emailRegex.test(cleanedEmail)) {

            setError('Please enter a valid email address.');

            return;
        }

        // ==========================================
        // COMMON MISSPELLED DOMAIN VALIDATION
        // ==========================================

        const suggestedDomain = getDomainSuggestion(cleanedEmail);

        if (suggestedDomain) {

            setError(
                `Incorrect email domain. Did you mean ${suggestedDomain}? Please check the email address.`
            );

            return;
        }

        // ==========================================
        // PREPARE USER DATA
        // ==========================================

        const user = {
            name: cleanedName,
            email: cleanedEmail,
            password: password,
            role: role.trim()
        };

        setLoading(true);

        try {

            // ==========================================
            // CREATE NEW USER REQUEST
            // ==========================================

            const response = await fetch(`${URL}/api/userLG/signup`, {

                method: 'POST',

                body: JSON.stringify(user),

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userLG.token}`
                }

            });

            const json = await response.json();

            if (!response.ok) {

                setError(
                    json.error || 'Failed to create user. Please try again.'
                );

            } else {

                // ==========================================
                // SUCCESSFUL USER CREATION
                // ==========================================

                setError(null);

                setName('');
                setEmail('');
                setPassword('');
                setRole('');

                dispatch({
                    type: 'CREATE_USER',
                    payload: json
                });

                setOpenSuccessModal(true);

            }

        } catch (error) {

            setError('Something went wrong.');

            console.error('Error creating user:', error);

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // TOGGLE PASSWORD VISIBILITY
    // ==========================================

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleNameChange = (e) => {
        setName(e.target.value);
        setError(null);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setError(null);
    };

    // ==========================================
    // ROLE OPTIONS
    // ==========================================

    const roles = [
        { value: 'Lead Generation', label: 'Lead Generation' },
        { value: 'Telemarketer', label: 'Telemarketer' },
        { value: 'Team Leader', label: 'Team Leader' },
    ];

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
            display="flex"
            justifyContent="center"
            mt={6}
            sx={{
                width: '100%',
                padding: '10px',
                maxWidth: '1200px',
                mx: 'auto'
            }}
        >

            <Box className="w-full max-w-xl mx-auto p-12 bg-[#1f2937] rounded-lg shadow-md">

                <div className="flex items-center justify-center mb-6">

                    <img
                        src={process.env.PUBLIC_URL + '/logo.png'}
                        alt="logo"
                        className="image-xl mt-3 rounded cursor-pointer"
                    />

                    <h2 className="font-bold text-3xl text-center text-[#f4f5fd] mt-3 ml-3">
                        Chromagen
                    </h2>

                </div>

                <h2 className='text-xl text-center text-[#4cceac] mb-7 ml-4'>
                    Create New User
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* FULL NAME */}

                    <div className='mb-6'>

                        <label
                            className="block text-white text-sm font-semibold mb-2"
                            htmlFor="fullName"
                        >
                            Full Name
                        </label>

                        <TextField
                            fullWidth
                            variant="outlined"
                            type="text"
                            placeholder="Full Name"
                            onChange={handleNameChange}
                            value={name}
                            name="fullName"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#4b5563',
                                    color: '#ffffff',
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#ffffff',
                                },
                            }}
                        />

                    </div>

                    {/* EMAIL */}

                    <div className='mb-6'>

                        <label
                            className="block text-white text-sm font-semibold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>

                        <TextField
                            fullWidth
                            variant="outlined"
                            type="email"
                            placeholder="chromagen@sortr.com.au"
                            onChange={handleEmailChange}
                            value={email}
                            name="email"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#4b5563',
                                    color: '#ffffff',
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#ffffff',
                                },
                            }}
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className='mb-10'>

                        <label
                            className="block text-white text-sm font-semibold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <TextField
                            fullWidth
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter unique password"
                            onChange={handlePasswordChange}
                            value={password}
                            name="password"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#4b5563',
                                    color: '#ffffff',
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#ffffff',
                                },
                            }}
                            InputProps={{
                                endAdornment: showPassword ? (

                                    <VisibilityOffIcon
                                        className="cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    />

                                ) : (

                                    <VisibilityIcon
                                        className="cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    />

                                )
                            }}
                        />

                    </div>

                    {/* SELECT ROLE */}

                    <div className='mb-9'>

                        <FormControl fullWidth variant="outlined" required>

                            <InputLabel sx={{ color: '#ffffff' }}>
                                Select Role
                            </InputLabel>

                            <MuiSelect
                                value={role}
                                onChange={handleRoleChange}
                                label="Select Role"
                                sx={{
                                    backgroundColor: '#4b5563',
                                    color: '#ffffff',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6',
                                    },
                                }}
                            >

                                <MenuItem value="">
                                    None
                                </MenuItem>

                                {roles.map((role) => (

                                    <MenuItem
                                        key={role.value}
                                        value={role.value}
                                    >
                                        {role.label}
                                    </MenuItem>

                                ))}

                            </MuiSelect>

                        </FormControl>

                    </div>

                    {/* SUBMIT BUTTON */}

                    <div className='flex justify-center mt-14'>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{
                                bgcolor: '#9c1c1c',
                                '&:hover': {
                                    bgcolor: '#3b82f6',
                                },
                            }}
                        >

                            {loading
                                ? <CircularProgress size={24} />
                                : "Add New User"
                            }

                        </Button>

                    </div>

                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="text-red-500 mt-2 text-center">
                            {error}
                        </div>

                    )}

                </form>

            </Box>

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
                        left: '56%',
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

                    <div style={{
                        fontSize: '20px',
                        marginTop: '10px'
                    }}>
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
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '56%',
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

                    <div style={{
                        fontSize: '20px',
                        marginTop: '10px'
                    }}>
                        New User Added Successfully!
                    </div>

                </Box>

            </Modal>

        </Box>
    );
};

export default AddUser;
