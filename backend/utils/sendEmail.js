const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email message details
  const message = {
    from: `${process.env.EMAIL_FROM || 'noreply@testportal.com'}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Support HTML emails
  };

  // Send the mail
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
