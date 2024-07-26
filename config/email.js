const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendEmail(subject, text, to) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "",
    subject: "Gracias!!! ❤️",
    text: "Gracias, sigamos platicando, talvez no contenga mi emocio"
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error;
    console.log('Email sent: ' + info.response);
  });
}

module.exports = sendEmail;
