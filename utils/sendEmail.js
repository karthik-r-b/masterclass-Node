'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const sendMail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transport.sendMail(message);

  console.log(`Message sent: ${info.messageId}`);
};
module.exports = sendMail;
