import React, { useState } from 'react';
import { URL } from "../../utils/URL";
import { useParams, useNavigate } from 'react-router-dom';

/** --- MATERIAL UI --- */
import { Box, Button, TextField, CircularProgress, Modal } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${URL}/api/password/reset-password`, {
                method: 'POST',
                body: JSON.stringify({ id, password, token: code }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            } else {
                setOpenSuccessModal(true);
                setTimeout(() => {
                    navigate('/loginLG');
                }, 3000); // Redirect to login page after 3 seconds
            }
        } catch (error) {
            setError('Something went wrong');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: '#f1f1f1',
                border: '2px solid #000',
                boxShadow: 24,
                p: 6,
                borderRadius: '30px'
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Reset Password</div>
                <Box position="relative" marginBottom="20px">
                    <TextField
                        fullWidth
                        variant="filled"
                        type={showPassword ? "text" : "password"}
                        label="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        sx={{ backgroundColor: "#c2c2c2" }}
                    />
                    {showPassword ? (
                        <VisibilityOffIcon
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                            onClick={togglePasswordVisibility}
                        />
                    ) : (
                            <VisibilityIcon
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            />
                        )}
                </Box>
                <Box position="relative" marginBottom="20px">
                    <TextField
                        fullWidth
                        variant="filled"
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        required
                        sx={{ backgroundColor: "#c2c2c2" }}
                    />
                    {showConfirmPassword ? (
                        <VisibilityOffIcon
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        />
                    ) : (
                            <VisibilityIcon
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                            />
                        )}
                </Box>
                <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Verification Code"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    required
                    sx={{ backgroundColor: "#c2c2c2", marginBottom: '20px' }}
                />
                <Box mt={2}>
                    <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#3e4396' }}>
                        {loading ? <CircularProgress size={24} /> : "Reset Password"}
                    </Button>
                </Box>
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </form>
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
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 60 }} />
                    <div className="success">Password reset successfully!</div>
                </Box>
            </Modal>
        </Box>
    );
};

export default ResetPassword;
