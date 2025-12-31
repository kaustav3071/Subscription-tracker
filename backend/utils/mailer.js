import nodemailer from 'nodemailer';

export function getTransport() {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;
  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) return null;
  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: Number(MAIL_PORT) === 465,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
}

export async function sendMail({ to, subject, html, text }) {
  const transporter = getTransport();
  const from = process.env.MAIL_FROM || 'no-reply@example.com';
  if (!transporter) {
    console.log('[mailer.disabled]', { to, subject });
    return false;
  }
  await transporter.sendMail({ from, to, subject, html, text });
  return true;
}
