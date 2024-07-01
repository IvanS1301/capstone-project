import React, { useState } from 'react';
import { URL } from "@utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Modal, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXT --- */
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userLG) {
            setError('You must be logged in');
            return;
        }

        const user = { name, email, password, role };

        setLoading(true); // Set loading to true when submitting the form

        try {
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
                setError(json.error);
            } else {
                setError(null);
                setName('');
                setEmail('');
                setPassword('');
                setRole('');
                dispatch({ type: 'CREATE_USER', payload: json });
                setOpenSuccessModal(true); // Open success modal when user is created successfully
            }
        } catch (error) {
            setError('Something went wrong');
            console.error('Error creating user:', error);
        } finally {
            setLoading(false); // Set loading to false after form submission
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    /** --- FOR SELECTION --- */
    const roles = [
        { value: 'Lead Generation', label: 'Lead Generation' },
        { value: 'Telemarketer', label: 'Telemarketer' },
        { value: 'Team Leader', label: 'Team Leader' },
    ];

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
    };

    return (
        <Box display="flex" justifyContent="center" mt={6} sx={{ width: '100%', height: '70vh', padding: '10px', maxWidth: '1200px', mx: 'auto' }}>
            <Box className="w-full max-w-xl mx-auto p-12 bg-[#062438] rounded-lg shadow-md">
                <div className="flex items-center justify-center mb-6">
                    <img
                        src={process.env.PUBLIC_URL + '/logo.png'}
                        alt="logo"
                        className="image-xl mt-3 rounded cursor-pointer"
                    />
                    <h2 className="font-bold text-3xl text-center text-[#f4f5fd] mt-3 ml-3">Chromagen</h2>
                </div>
                <h2 className='text-xl text-center text-[#4cceac] mb-7 ml-4'>Create New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-6'>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="fullName">Full Name</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="text"
                            placeholder="Full Name"
                            onChange={(e) => setName(e.target.value)}
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
                    <div className='mb-6'>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">Email</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type="email"
                            placeholder="chromagen@sortr.com.au"
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div className='mb-9'>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter unique password"
                            onChange={(e) => setPassword(e.target.value)}
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
                                endAdornment: (
                                    <img
                                        src={process.env.PUBLIC_URL + '/eye.svg'}
                                        alt="eye"
                                        className="cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    />
                                ),
                            }}
                        />
                    </div>
                    <div className='mb-9'>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel sx={{ color: '#ffffff' }}>Select Role</InputLabel>
                            <MuiSelect
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
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
                                <MenuItem value="">None</MenuItem>
                                {roles.map((role) => (
                                    <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                                ))}
                            </MuiSelect>
                        </FormControl>
                    </div>
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
                            {loading ? <CircularProgress size={24} /> : "Add New User"}
                        </Button>
                    </div>
                    {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
                </form>
            </Box>

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
                    <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 60 }} />
                    <div style={{ fontSize: '20px', marginTop: '10px' }}>New User Added Successfully!</div>
                </Box>
            </Modal>
        </Box>
    );
};

export default AddUser;
