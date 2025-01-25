import nodemailer from 'nodemailer';

export const sendEmail = async (mailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER, // SMTP server
            port: parseInt(process.env.EMAIL_PORT, 10), // Port number
            secure: process.env.EMAIL_PORT === '465', // True for port 465, false for others
            auth: {
                user: process.env.EMAIL_USER, // SMTP username
                pass: process.env.EMAIL_PASS, // SMTP password
            },
        });

        // Verify SMTP configuration
        const isVerified = await transporter.verify();
        if (isVerified) {
            console.log('SMTP server is ready to take messages.');
        }

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        return info; // Return info for success status
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email'); // Rethrow for further handling
    }
};
