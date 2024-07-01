import { Box, Typography } from "@mui/material";

import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {


    return (
        <Box width="100%" m="0 90px" display="flex">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center">
                        {icon}
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "#e0e0e0", mr: 20, ml: 3, position: "relative" }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ color: "#4cceac", mt: 2 }}>
                        {subtitle}
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <ProgressCircle progress={progress} />
                    <Typography
                        variant="h5"
                        fontStyle="italic"
                        sx={{ color: "#94a3b8", ml: 1, mt: 2, position: "relative" }}
                    >
                        {increase}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default StatBox;