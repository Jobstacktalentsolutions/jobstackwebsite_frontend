"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
    onAction: () => void;
    title?: string;
    actionLabel?: string;
    message?: React.ReactNode;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 16,
        padding: theme.spacing(4),
        width: "100%",
        maxWidth: 500,
    },
}));

export default function SuccessModal({
    open,
    onClose,
    onAction,
    title = "Password Reset Successful!",
    actionLabel = "Log in",
    message,
}: SuccessModalProps) {
    return (
        <StyledDialog open={open} onClose={onClose}>
            {/* Close button */}
            <IconButton
                onClick={onClose}
                aria-label="close"
                sx={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    border: "1px solid currentColor",
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Check icon */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 3 }}>
                <Box sx={{
                    width: 80, height: 80, borderRadius: "50%",
                    backgroundColor: "#E6F2FA", display: "flex",
                    alignItems: "center", justifyContent: "center"
                }}>
                    <CheckCircleIcon sx={{ fontSize: 48, color: "#206B9C" }} />
                </Box>
            </Box>

            {/* Title */}
            <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 2 }}>
                {title}
            </Typography>

            {/* Optional message */}
            {message && (
                <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
                    {message}
                </Typography>
            )}

            {/* Action button */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    onClick={onAction}
                    sx={{
                        minWidth: 200, py: 1.5, textTransform: "none", backgroundColor: "#206B9C",
                        color: "#FFFFFF",
                        "&:hover": {
                            backgroundColor: "#18576d",
                        }
                    }}

                        >
                        { actionLabel }
                </Button>
        </Box>
        </StyledDialog >
    );
}
