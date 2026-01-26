import sgMail from '@sendgrid/mail';

export async function sendMail({ to, subject, html, text }) {
  // Read environment variables inside the function to ensure dotenv has loaded them
  const { SENDGRID_API_KEY, SENDER_EMAIL, MAIL_FROM } = process.env;
  const from = SENDER_EMAIL || MAIL_FROM || 'no-reply@example.com';

  if (!SENDGRID_API_KEY) {
    console.log('[mailer.disabled] SendGrid API key not configured', { to, subject });
    return false;
  }

  // Set API key each time to ensure it's configured
  sgMail.setApiKey(SENDGRID_API_KEY);

  try {
    const msg = {
      to,
      from,
      subject,
      ...(html && { html }),
      ...(text && { text }),
    };

    await sgMail.send(msg);
    console.log('[mailer] Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('[mailer] SendGrid error:', error.message);
    if (error.response) {
      console.error('[mailer] SendGrid response body:', error.response.body);
    }
    return false;
  }
}
