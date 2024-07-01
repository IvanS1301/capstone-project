import React, { useState } from 'react';
import { URL } from "../../../utils/URL";
import { Box, Button, TextField, CircularProgress, Modal } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${URL}/api/password/forgot-password`, {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
            } else {
                setOpenSuccessModal(true);
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

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: '#f1f1f1',
                border: '2px solid #000',
                boxShadow: 24,
                p: 5,
                borderRadius: '30px',
                textAlign: 'center',
            }}
        >
            <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Forgot Password</div>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    variant="filled"
                    type="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    sx={{ backgroundColor: "#c2c2c2", marginBottom: '20px' }}
                />
                <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#3e4396' }}>
                    {loading ? <CircularProgress size={24} /> : "Send"}
                </Button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
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
                    <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 80 }} />
                    <div className="success">An email has been sent to {email} with further instructions.</div>
                </Box>
            </Modal>
        </Box>
    );
};

export default ForgotPassword;
