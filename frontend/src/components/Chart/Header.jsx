import { Typography, Box } from "@mui/material";


const Header = ({ title, subtitle }) => {

    return (
        <Box mb="30px">
            <Typography
                variant="h4"
                color="#e0e0e0"
                fontWeight="bold"
                sx={{ m: "0 0 5px 0", mt: "25px", ml: "30px"}}
            >
                {title}
            </Typography>
            <Typography variant="h5" color="#70d8bd" sx={{ ml: "30px"}}>
                {subtitle}
            </Typography>
        </Box>
    );
};

export default Header
