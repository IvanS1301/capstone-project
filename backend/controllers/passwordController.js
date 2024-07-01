require('dotenv').config()
const UserLG = require('../models/userLGmodel')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userLG = await UserLG.findOne({ email });
        if (!userLG) {
            throw new Error('No account with that email address exists.');
        }

        // Generate a token
        const token = jwt.sign({ _id: userLG._id }, process.env.SECRET, { expiresIn: '1h' });

        // Set token and expiration on user
        userLG.resetPasswordToken = token;
        userLG.resetPasswordExpires = Date.now() + 3600000; // 1 hour
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
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${userLG._id}/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'An e-mail has been sent to ' + userLG.email + ' with further instructions.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const userLG = await UserLG.findOne({
            _id: decoded._id,
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