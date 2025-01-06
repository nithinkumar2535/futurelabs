import nodemailer from 'nodemailer';

export const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER, 
      port: process.env.EMAIL_PORT,                  
      secure: true,             
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS       
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('Error connecting to SMTP server:', error);
      } else {
        console.log('SMTP server is ready to take messages');
      }
    });

    

    await transporter.sendMail(mailOptions);
};



