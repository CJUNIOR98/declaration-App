const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = require('./config/db');
const sendEmail = require('./config/email'); // Importar la función de envío de correo

// Configuración de la sesión
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use secure: true in production with HTTPS
}));

// Register user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err) => {
      if (err) throw err;
      res.redirect('/login.html');
    });
  });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(401).send('Invalid credentials');
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) throw err;
      if (!match) return res.status(401).send('Invalid credentials');
      const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
      req.session.user = { id: user.id, email: user.email }; // Almacenar el usuario en la sesión
      res.cookie('token', token);
      res.redirect('/proposal.html');
    });
  });
});

// Proposal endpoint
app.post('/submit-proposal', (req, res) => {
  const { answer } = req.body;
  if (answer === 'yes') {
    res.redirect('/success.html');
  } else {
    res.redirect('/rejection.html');
  }
});

// Handle rejection
app.post('/rejection', (req, res) => {
  const { answer } = req.body;
  if (answer === 'yes') {
    res.redirect('/success.html');
  } else {
    res.redirect('/confirmation.html');
  }
});

app.post('/success', (req, res) => {
  const userEmail = req.session.user.email; // Obtener el correo electrónico del usuario de la sesión
  sendEmail('Thank You!', 'Thanks for giving me a chance.', userEmail);
  res.redirect(process.env.YOUTUBE_VIDEO_URL);
});

// Endpoint to get video URL
app.get('/get-video-url', (req, res) => {
  res.json({ videoUrl: process.env.YOUTUBE_VIDEO_URL });
});

// Endpoint to send email
app.post('/send-email', (req, res) => {
  const userEmail = req.session.user.email; // Obtener el correo electrónico del usuario de la sesión
  sendEmail('Thank You!', 'Thanks for giving me a chance.', userEmail);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
