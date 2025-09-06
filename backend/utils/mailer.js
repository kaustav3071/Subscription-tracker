import nodemailer from 'nodemailer';

export function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
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
