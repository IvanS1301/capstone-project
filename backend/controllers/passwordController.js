require('dotenv').config();

const UserLG = require('../models/userLGModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ==========================================
// EMAIL TRANSPORTER CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },

    // Prevent SMTP operations from hanging indefinitely
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
});

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    console.log('[FORGOT PASSWORD] Request received');

    try {
        // ------------------------------------------
        // STEP 1: Validate request
        // ------------------------------------------

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                error: 'A valid email address is required.',
            });
        }

        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
            console.error('[FORGOT PASSWORD] Email environment variables are missing');

            return res.status(500).json({
                error: 'Email service is not configured.',
            });
        }

        // ------------------------------------------
        // STEP 2: Find account
        // ------------------------------------------

        console.log('[FORGOT PASSWORD] Checking account');

        const userLG = await UserLG.findOne({
            email: email.trim(),
        }).maxTimeMS(10000);

        console.log('[FORGOT PASSWORD] Account lookup completed');

        if (!userLG) {
            return res.status(400).json({
                error: 'No account with that email address exists.',
            });
        }

        // ------------------------------------------
        // STEP 3: Generate verification code
        // ------------------------------------------

        const resetToken = crypto.randomBytes(3).toString('hex');
        const resetTokenExpiration = Date.now() + 30 * 60 * 1000;

        userLG.resetPasswordToken = resetToken;
        userLG.resetPasswordExpires = resetTokenExpiration;

        await userLG.save();

        console.log('[FORGOT PASSWORD] Verification code generated');

        // ------------------------------------------
        // STEP 4: Prepare email
        // ------------------------------------------

        const mailOptions = {
            to: userLG.email,
            from: process.env.EMAIL,
            subject: 'Password Reset',
            text: `You requested a password reset. Use this verification code within the next 30 minutes: ${resetToken}`,
            html: `
                <p>You requested a password reset.</p>
                <p>
                    Use this verification code within the next
                    30 minutes:
                    <strong>${resetToken}</strong>
                </p>
            `,
        };

        // ------------------------------------------
        // STEP 5: Send email
        // ------------------------------------------

        console.log('[FORGOT PASSWORD] Connecting to email service');

        const emailResult = await transporter.sendMail(mailOptions);

        console.log('[FORGOT PASSWORD] Email sent successfully', {
            messageId: emailResult.messageId,
            accepted: emailResult.accepted.length,
            rejected: emailResult.rejected.length,
        });

        // ------------------------------------------
        // STEP 6: Respond to frontend
        // ------------------------------------------

        return res.status(200).json({
            message: 'A password reset verification code has been sent to your email.',
        });

    } catch (error) {
        // ------------------------------------------
        // ERROR HANDLING
        // ------------------------------------------

        console.error('[FORGOT PASSWORD ERROR]', {
            message: error.message,
            code: error.code,
            command: error.command,
            name: error.name,
        });

        if (error.code === 'ETIMEOUT' || error.code === 'ETIMEDOUT') {
            return res.status(504).json({
                error: 'The email service timed out. Please try again later.',
            });
        }

        if (error.code === 'EAUTH') {
            return res.status(500).json({
                error: 'The email service could not authenticate. Please contact support.',
            });
        }

        if (error.name === 'MongooseError' ||
            error.name === 'MongoServerError') {
            return res.status(500).json({
                error: 'A database error occurred. Please try again later.',
            });
        }

        return res.status(500).json({
            error: 'Unable to process the password reset request.',
        });
    }
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    console.log('[RESET PASSWORD] Request received');

    try {
        // ------------------------------------------
        // STEP 1: Validate request
        // ------------------------------------------

        if (
            typeof token !== 'string' ||
            !token.trim() ||
            typeof password !== 'string' ||
            password.length < 8
        ) {
            return res.status(400).json({
                error: 'A valid verification code and a password of at least 8 characters are required.',
            });
        }

        // ------------------------------------------
        // STEP 2: Find valid reset token
        // ------------------------------------------

        const userLG = await UserLG.findOne({
            resetPasswordToken: token.trim(),
            resetPasswordExpires: { $gt: Date.now() },
        }).maxTimeMS(10000);

        if (!userLG) {
            return res.status(400).json({
                error: 'The verification code is invalid or has expired.',
            });
        }

        // ------------------------------------------
        // STEP 3: Hash new password
        // ------------------------------------------

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // ------------------------------------------
        // STEP 4: Save new password
        // ------------------------------------------

        userLG.password = hash;
        userLG.resetPasswordToken = undefined;
        userLG.resetPasswordExpires = undefined;

        await userLG.save();

        console.log('[RESET PASSWORD] Password reset successfully');

        return res.status(200).json({
            message: 'Password has been reset successfully.',
        });

    } catch (error) {
        console.error('[RESET PASSWORD ERROR]', {
            message: error.message,
            code: error.code,
            name: error.name,
        });

        return res.status(500).json({
            error: 'Unable to reset the password. Please try again later.',
        });
    }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    forgotPassword,
    resetPassword,
};
