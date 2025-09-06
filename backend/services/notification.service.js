import { sendMail } from '../utils/mailer.js';

export async function notifyRenewalReminder(user, sub) {
  const subject = `Reminder: ${sub.name} renews on ${new Date(sub.nextChargeDate).toDateString()}`;
  const to = user.email;
  const html = `<p>Hi ${user.name || ''},</p><p>Your subscription <b>${sub.name}</b> will renew on <b>${new Date(sub.nextChargeDate).toDateString()}</b>.</p>`;
  return sendMail({ to, subject, html });
}

export async function notifySpendingAlert(user, period, total, threshold, currency = 'USD') {
  const subject = `Spending alert: ${period} total ${total} ${currency}`;
  const to = user.email;
  const html = `<p>Hi ${user.name || ''},</p><p>Your subscriptions total <b>${total} ${currency}</b> for ${period}, which exceeds your threshold of <b>${threshold} ${currency}</b>.</p>`;
  return sendMail({ to, subject, html });
}

export async function notifySubscriptionUpdated(user, sub, changed = {}) {
  const subject = `${sub.name} subscription updated`;
  const to = user.email;
  const summary = Object.entries(changed).map(([k, v]) => `${k}: ${v}`).join('<br/>');
  const html = `<p>Hi ${user.name || ''},</p><p>Your subscription <b>${sub.name}</b> was updated.</p><p>${summary}</p>`;
  return sendMail({ to, subject, html });
}

export async function notifySubscriptionDeleted(user, subName) {
  const subject = `${subName} subscription deleted`;
  const to = user.email;
  const html = `<p>Hi ${user.name || ''},</p><p>Your subscription <b>${subName}</b> has been removed.</p>`;
  return sendMail({ to, subject, html });
}

export async function notifyAdminNewUser(user) {
  const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!to) return false;
  const subject = `New user registered: ${user.email}`;
  const html = `<p>Name: ${user.name || ''}</p><p>Email: ${user.email}</p>`;
  return sendMail({ to, subject, html });
}
