import { Box, Typography } from "@mui/material";

const ProgressCircle = ({ progress = 0, size = 40, showText = false, text = "" }) => {
    const angle = (progress / 100) * 360;
    const primaryColor = "#1F2A40";
    const blueAccentColor = "#0c101b";
    const greenAccentColor = "#6870fa";

    return (
        <Box
            sx={{
                position: "relative",
                background: `radial-gradient(${primaryColor} 55%, transparent 56%),
                             conic-gradient(transparent 0deg ${angle}deg, ${blueAccentColor} ${angle}deg 360deg),
                             ${greenAccentColor}`,
                borderRadius: "50%",
                width: `${size}px`,
                height: `${size}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
            }}
        >
            {showText && (
                <Typography variant="h6" component="div">
                    {text}
                </Typography>
            )}
        </Box>
    );
};

export default ProgressCircle;