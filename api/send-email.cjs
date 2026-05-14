const nodemailer = require('nodemailer');

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_PLACEHOLDERS = new Set([
  'your-gmail@gmail.com',
  'your-gmail-address@gmail.com',
  'your-gmail-app-password'
]);

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS || SMTP_PLACEHOLDERS.has(SMTP_USER) || SMTP_PLACEHOLDERS.has(SMTP_PASS)) {
    throw new Error('Configure SMTP_USER et SMTP_PASS dans les variables d environnement du serveur.');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Methode non autorisee.' });
  }

  const { to, name } = req.body || {};

  if (!to) {
    return res.status(400).json({ message: 'Adresse email destinataire manquante.' });
  }

  const mailOptions = {
    from: SMTP_USER,
    to,
    subject: 'Haute Couture vous ouvre ses portes !',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
        <h1 style="color: #333;">Felicitations ${escapeHtml(name)} !</h1>
        <p>Ton compte a ete cree avec succes.</p>
        <p style="font-style: italic; color: #666;">On vous attend...</p>
      </div>
    `
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email envoye !' });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Erreur lors de l'envoi" });
  }
};
