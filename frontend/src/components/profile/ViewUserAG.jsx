import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Container, Typography, Box, Paper, Modal, Backdrop, Fade, Button, Grid, Menu, MenuItem, Snackbar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadIcon from '@mui/icons-material/Upload';

/** --- FOR MODAL --- */
import EditUserAG from '../../pages/profile/EditUserAG';
import AgentStatus from '../../pages/agent/AgentStatus';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

/** --- IMPORT CONTEXT --- */
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- IMPORT COMPRESSOR LIBRARY --- */
import Compressor from 'compressorjs';

const ViewUserAG = ({ onUserUpdate }) => {
    const { id } = useParams();
    const { userlgs, dispatch } = useUsersContext();
    const { userLG } = useAuthContext();
    const { dispatch: authDispatch } = useAuthContext();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // State for the menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    // Find the userlg with the specified ID
    const userlg = userlgs.find(userlg => userlg._id === id);

    useEffect(() => {
        if (userlg && userlg.profileImage) {
            setProfileImage(userlg.profileImage);
        }
    }, [userlg]);

    if (!userlg) {
        return <Typography>User not found</Typography>; // Or any other appropriate handling
    }

    const formattedBirthday = userlg.birthday ? moment(userlg.birthday).format('YYYY-MM-DD') : '';

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    const handleOpenStatusModal = () => {
        setOpenStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        setOpenStatusModal(false);
    };

    const handleOpenImageModal = () => {
        setOpenImageModal(true);
        handleCloseMenu();
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6, // Adjust the quality as needed (0.6 is 60% quality)
                success(result) {
                    const reader = new FileReader();
                    reader.readAsDataURL(result);
                    reader.onload = async () => {
                        const base64Image = reader.result;
                        setProfileImage(base64Image);
                        try {
                            const response = await fetch(`${URL}/api/userLG/${userlg._id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userLG.token}`
                                },
                                body: JSON.stringify({ profileImage: base64Image })
                            });
                            const data = await response.json();
                            if (response.ok) {
                                console.log('Image uploaded successfully', data);
                                dispatch({ type: 'UPDATE_USER', payload: data });
                                authDispatch({ type: 'UPDATE_PROFILE_IMAGE', payload: data.profileImage }); // Update profile image in context
                                setProfileImage(data.profileImage);
                                setSnackbarMessage('Image uploaded successfully!');
                                setSnackbarOpen(true);
                            } else {
                                console.error('Error in response', data);
                            }
                        } catch (error) {
                            console.error('There was an error uploading the image!', error);
                        }
                    };
                },
                error(err) {
                    console.error('Error in compression', err);
                }
            });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const triggerFileUpload = () => {
        document.getElementById('fileInput').click();
        handleCloseMenu();
    };

    return (
        <Container maxWidth="md">
            <Box display="flex" flexDirection="column" alignItems="center" paddingY={3}>
        <Paper
            elevation={3}
            sx={{
                padding: 6,
                borderRadius: 6,
                width: '100%',
                maxWidth: 800,
                textAlign: 'center',
                backgroundColor: '#111827',
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box display="flex" justifyContent="flex-end" alignItems="center" marginBottom={4}>
                    <img
                        src={process.env.PUBLIC_URL + '/logo.png'}
                        alt="logo"
                        style={{ width: '50px', height: '50px', marginRight: '8px' }}
                    />
                    <Typography variant="h6" component="h5" style={{ color: '#e0e0e0', fontSize: '1.9rem', marginTop: '2px' }}>Chromagen</Typography>
                </Box>
                <Box
                    sx={{
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginBottom: 2,
                        cursor: 'pointer',
                        marginLeft: '20px'
                    }}
                    onClick={handleMenuClick}
                >
                    <img
                        alt="profile-user"
                        src={profileImage || process.env.PUBLIC_URL + '/icon.png'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleOpenImageModal}>
                        <VisibilityIcon sx={{ marginRight: 1 }} /> See Profile Picture
                    </MenuItem>
                    <MenuItem onClick={triggerFileUpload}>
                        <UploadIcon sx={{ marginRight: 1 }} /> Choose Profile Picture
                    </MenuItem>
                </Menu>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
                <Typography variant="h3" style={{ fontWeight: 'bold', color: 'white', marginTop: '16px', marginLeft: '20px' }}>
                    {userlg.name}
                </Typography>
                <Typography variant="h5" color="#065f46" fontWeight="bold" marginTop="10px" marginLeft= '20px'>
                    {userlg.role}
                </Typography>
                <Typography variant="body1" color="error" fontWeight="bold" marginTop="10px" marginLeft= '20px'>
                    {userlg.status}
                </Typography>
            </Box>
            <Box marginTop={4} display="flex" justifyContent="center" gap={2} marginLeft= '20px'>
                <Button variant="contained" sx={{ backgroundColor: '#3e4396' }} onClick={handleOpenEditModal}>
                    Update Profile
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#D22B2B' }} onClick={handleOpenStatusModal}>
                    Update Status
                </Button>
            </Box>
            <Grid container spacing={3} marginTop={4} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" style={{ color: '#94e2cd', textAlign: 'center' }}>
                        Employee ID
                    </Typography>
                    <Typography variant="body1" style={{ color: '#e0e0e0', fontSize: '1.2rem', textAlign: 'center' }}>
                        {userlg._id.slice(-8)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" style={{ color: '#94e2cd', textAlign: 'center', marginRight: '60px' }}>
                        Birthday
                    </Typography>
                    <Typography variant="body1" style={{ color: '#e0e0e0', fontSize: '1.2rem', textAlign: 'center', marginRight: '60px' }}>
                        {formattedBirthday}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" style={{ color: '#94e2cd', textAlign: 'center' }}>
                        Phone Number
                    </Typography>
                    <Typography variant="body1" style={{ color: '#e0e0e0', fontSize: '1.2rem', textAlign: 'center' }}>
                        {userlg.number}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" style={{ color: '#94e2cd', textAlign: 'center', marginRight: '60px' }}>
                        Email
                    </Typography>
                    <Typography variant="body1" style={{ color: '#e0e0e0', fontSize: '1.2rem', textAlign: 'center', marginRight: '60px' }}>
                        {userlg.email}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" style={{ color: '#94e2cd', textAlign: 'center' }}>
                        Address
                    </Typography>
                    <Typography variant="body1" style={{ color: '#e0e0e0', fontSize: '1.2rem', textAlign: 'center' }}>
                        {userlg.homeaddress}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" style={{ color: '#94e2cd', textAlign: 'center', marginRight: '60px' }}>
                        Gender
                    </Typography>
                    <Typography variant="body1" style={{ color: '#e0e0e0', fontSize: '1.2rem', textAlign: 'center', marginRight: '60px' }}>
                        {userlg.gender}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    </Box>

            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                className="bounce-in-modal"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openEditModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '56.3%',
                            transform: 'translate(-50%, -50%)',
                            width: 800,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <EditUserAG userId={userlg._id} handleClose={handleCloseEditModal} onUserUpdate={onUserUpdate} />
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={openStatusModal}
                onClose={handleCloseStatusModal}
                className="bounce-in-modal"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openStatusModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '56.3%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <AgentStatus userId={userlg._id} handleClose={handleCloseStatusModal} onUserUpdate={onUserUpdate} />
                    </Box>
                </Fade>
            </Modal>

            <Modal
                open={openImageModal}
                onClose={handleCloseImageModal}
                aria-labelledby="image-modal-title"
                aria-describedby="image-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openImageModal}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <img
                            alt="profile-user"
                            width="100%"
                            src={profileImage || process.env.PUBLIC_URL + '/icon.png'}
                            className="cursor-pointer rounded-full"
                        />
                    </Box>
                </Fade>
            </Modal>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#141b2d',
                        color: '#e0e0e0',
                        fontSize: '20px',
                        borderRadius: '8px',
                        minWidth: '500px',
                        textAlign: 'center',
                    },
                    '& .MuiSnackbarContent-message': {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }
                }}
                message={(
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: '30px', marginRight: '10px' }} />
                        {snackbarMessage}
                    </span>
                )}
            />
        </Container >
    );
};

export default ViewUserAG;
