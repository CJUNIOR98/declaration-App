const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Desactiva la verificación de certificados
    }
});

function sendEmail(subject, text, to) {
  const mailOptions = {
    from: `"Gracias por aceptar 💕" <${process.env.EMAIL_SENDER}>` , // Correo remitente fijo
    to: 'carlosjuniorm360@gmail.com',
    subject: "test",
    text: "working"
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendEmail;
