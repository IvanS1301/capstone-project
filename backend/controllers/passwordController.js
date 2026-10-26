require('dotenv').config()
const UserLG = require('../models/userLGModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userLG = await UserLG.findOne({ email });
        if (!userLG) {
            throw new Error('No account with that email address exists.');
        }

        // Generate a token
        const resetToken = crypto.randomBytes(3).toString('hex');
        const resetTokenExpiration = Date.now() + 1800000 // 30 minutes

        // Set token and expiration on user
        userLG.resetPasswordToken = resetToken;
        userLG.resetPasswordExpires = resetTokenExpiration;
        await userLG.save();

        // Send email with the token
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password
            },
        });

        const mailOptions = {
            to: userLG.email,
            from: process.env.EMAIL,
            subject: 'Password Reset',
            text: `You are receiving this because you requested a password reset for your account. Please use this verification code to reset your password within the next 30 minutes: ${resetToken}`,
            html: `
                <p>You are receiving this because you requested a password reset for your account.<br>
                Please use this verification code to reset your password within the next 30 minutes: <strong>${resetToken}</strong></p>
            `,
        };


        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'An e-mail has been sent to ' + userLG.email + ' with further instructions.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// reset password
const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const userLG = await UserLG.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!userLG) {
            throw new Error('Password reset token is invalid or has expired.');
        }

        // Update the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        userLG.password = hash;
        userLG.resetPasswordToken = undefined;
        userLG.resetPasswordExpires = undefined;
        await userLG.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
};
