import { useState, useEffect } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Typography, TextField, CircularProgress, Modal, Grid, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const EmailForm = ({ unassignedId, email, onLeadUpdate }) => {
    const { dispatch } = useEmailsContext();
    const { userLG } = useAuthContext();

    const subjectOptions = [
        "Introducing Our New Energy - Efficient Hot Water System!",
        "Congratulations! You're Eligible for a Free Hot Water System Upgrade",
        "Upgrade Your Hot Water System with State and Federal Rebates"
    ];

    const textTemplates = {
        "Introducing Our New Energy - Efficient Hot Water System!": `Dear [Customer's Name],

        We are excited to introduce our latest range of energy-efficient hot water systems, designed to provide you with reliable and cost-effective hot water solutions for your home.

        Why Choose Our Hot Water Systems?

        Energy Efficiency: Our new systems are designed to significantly reduce energy consumption, helping you save on your energy bills while minimizing your environmental footprint.
        Advanced Technology: Featuring the latest advancements in hot water technology, our systems ensure a consistent and dependable hot water supply.
        Durability and Reliability: Built with high-quality materials, our hot water systems are engineered for long-lasting performance and reliability.
        Professional Installation: Our team of certified professionals will ensure a seamless installation process, providing you with peace of mind and optimal performance.
        Rebates and Incentives: Take advantage of State and Federal rebates to make your upgrade even more affordable.

        Product Features:

        High Efficiency: Designed to meet and exceed energy efficiency standards.
        Smart Controls: Easily monitor and manage your hot water usage with our intuitive smart controls.
        Compact Design: Space-saving designs that fit seamlessly into any home.

        Special Offer:

        For a limited time, we are offering exclusive discounts and financing options to help you upgrade to our new hot water systems. Don’t miss out on this opportunity to enhance your home’s comfort and efficiency.

        We look forward to helping you enjoy the benefits of our advanced hot water solutions.

        Best regards,

        [Telemarketer Name]  
        Customer Service Representative
        Chromagen`,

        "Congratulations! You're Eligible for a Free Hot Water System Upgrade": `Dear [Customer's Name],

        We are thrilled to inform you that you have been deemed eligible for a FREE hot water system upgrade under our exclusive offer, supported by State and Federal rebates.
        
        As part of our commitment to improving energy efficiency and providing cost-effective solutions, we have successfully installed thousands of hot water systems across Australia. Now, it’s your turn to benefit from this amazing opportunity!
        Benefits of Your Free Upgrade:
        
        No Cost to You: Take advantage of the State and Federal rebates to receive your new hot water system at no charge.
        Professional Installation: Our team of experts will handle the installation process, ensuring a smooth and hassle-free experience.
        Enhanced Efficiency: Upgrade to a modern, energy-efficient hot water system that can reduce your energy bills.
        Reliable Service: Enjoy a dependable and consistent hot water supply for your home.
        
        To proceed with your free upgrade, please contact us at your earliest convenience to schedule an installation appointment. You can reach us at [Your Contact Information] or visit our website at [Your Website URL] to learn more.
        
        Don’t miss out on this incredible opportunity to enhance your home’s hot water system with zero cost to you. We look forward to helping you enjoy the benefits of a new, efficient hot water system.
        
        Thank you for being a valued customer.
        
        Best regards,
        
        [Telemarketer Name]  
        Customer Service Representative
        Chromagen `,

        "Upgrade Your Hot Water System with State and Federal Rebates": `Dear [Customer's Name],

        We are excited to inform you about an exceptional opportunity to upgrade your hot water system through our exclusive offer, supported by State and Federal rebates.
        
        As part of this program, we have successfully installed thousands of hot water systems across Australia, helping households enjoy efficient and reliable hot water while benefiting from significant savings.
        
        Is your current unit in need of an upgrade? With our offer, you can take advantage of the following benefits:
        
        Substantial Rebates: Reduce your out-of-pocket expenses through generous State and Federal rebates.
        Expert Installation: Our team of professionals will handle the installation, ensuring a seamless and hassle-free experience.
        Energy Efficiency: Upgrade to a modern, energy-efficient hot water system that can lower your energy bills.
        Increased Reliability: Enjoy a consistent and dependable hot water supply for your home.
        
        Don’t miss out on this fantastic opportunity to enhance your home’s hot water system with significant savings and expert installation.
        
        Thank you for considering our offer. We look forward to helping you upgrade your hot water system and improve your home’s efficiency.
        
        Best regards,
        
        [Telemarketer Name]  
        Customer Service Representative
        Chromagen`
    };

    const [emailData, setEmailData] = useState({
        from: userLG.email || '',
        to: email || '',
        subject: '',
        text: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    useEffect(() => {
        setEmailData((prevData) => ({
            ...prevData,
            from: userLG.email || '',
            to: email || ''
        }));
    }, [email, userLG.email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'subject') {
            setEmailData((prevData) => ({
                ...prevData,
                [name]: value,
                text: textTemplates[value] || prevData.text
            }));
        } else {
            setEmailData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userLG) {
            setError('You must be logged in');
            setLoading(false);
            return;
        }

        const response = await fetch(`${URL}/api/emails/`, {
            method: 'POST',
            body: JSON.stringify(emailData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userLG.token}`
            }
        });

        const json = await response.json();
        setLoading(false);

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields || []);
        } else {
            setError(null);

            setEmptyFields([]);
            setOpenSuccessModal(true);
            dispatch({ type: 'CREATE_EMAIL', payload: json });
            setTimeout(() => {
                setOpenSuccessModal(false);
                onLeadUpdate();
            }, 2000);
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
                width: 900,
                bgcolor: '#f1f1f1',
                border: '2px solid #f1f1f1',
                boxShadow: 24,
                p: 5,
                borderRadius: '30px'
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="text-[#D22B2B] text-2xl mb-3 font-medium">Send An Email</div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="From"
                            name="from"
                            value={emailData.from}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('from')}
                            helperText={emptyFields.includes('from') && 'This field is required'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="To"
                            name="to"
                            value={emailData.to}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('to')}
                            helperText={emptyFields.includes('to') && 'This field is required'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={emailData.subject}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('subject')}
                            helperText={emptyFields.includes('subject') && 'This field is required'}
                            select
                        >
                            {subjectOptions.map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                    {subject}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            label="Text"
                            name="text"
                            value={emailData.text}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('text')}
                            helperText={emptyFields.includes('text') && 'This field is required'}
                            InputProps={{
                                sx: {
                                    padding: '0.5rem 1rem', // Adjust padding to align text properly
                                    lineHeight: '1.5rem' // Adjust line height if necessary
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box mt={2}>
                            <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#3e4396' }}>
                                {loading ? <CircularProgress size={24} /> : "Submit"}
                            </Button>
                        </Box>
                    </Grid>
                    {error && <Grid item xs={12}><div className="error">{error}</div></Grid>}
                </Grid>
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
                        border: '2px solid #f1f1f1',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '30px'
                    }}
                >
                    <CircularProgress sx={{ fontSize: 60 }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>Sending, please wait...</Typography>
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
                        border: '2px solid #f1f1f1',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '30px'
                    }}
                >
                    <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 60 }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>New email sent!</Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default EmailForm;
