import { sendMail } from '../utils/mailer.js';

function layout({ title, body, footer }) {
  const brand = 'Subscription Tracker';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>${title}</title>
    <style>
      body{background:#f5f7fa;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#1f2937;}
      .container{max-width:640px;margin:24px auto;background:#ffffff;border-radius:12px;padding:32px 40px;border:1px solid #e5e7eb;}
      h1,h2{margin:0 0 16px;font-weight:600;letter-spacing:.5px;}
      h1{font-size:22px;color:#111827;}
      p{line-height:1.5;margin:0 0 14px;font-size:14px;}
      .highlight{background:#eef3ff;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;}
      .pill{display:inline-block;background:#111827;color:#fff;padding:4px 10px;border-radius:16px;font-size:12px;margin:2px 4px 2px 0;}
      .meta-table{width:100%;border-collapse:collapse;margin:12px 0 20px;}
      .meta-table th{text-align:left;padding:6px 8px;background:#f3f4f6;font-size:12px;color:#374151;font-weight:600;border-bottom:1px solid #e5e7eb;}
      .meta-table td{padding:6px 8px;font-size:12px;border-bottom:1px solid #f1f5f9;}
      .footer{margin-top:32px;font-size:11px;color:#6b7280;text-align:center;}
      a.button{display:inline-block;background:#2563eb;color:#fff !important;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:14px;font-weight:600;margin-top:4px;}
      code{font-family:monospace;font-size:12px;background:#f3f4f6;padding:2px 6px;border-radius:4px;}
    </style></head><body>
    <div class="container">
      <h1>${title}</h1>
      ${body}
      <div class="footer">${footer || `${brand} • Automated message • Manage preferences coming soon.`}</div>
    </div>
  </body></html>`;
}

function formatDate(d) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export async function notifyRenewalReminder(user, sub) {
  const subject = `Upcoming renewal: ${sub.name} on ${new Date(sub.nextChargeDate).toDateString()}`;
  const to = user.email;
  const body = `
    <p>Hi ${user.name || 'there'},</p>
    <p>Your subscription <strong>${sub.name}</strong> will renew soon.</p>
    <table class="meta-table">
      <tr><th>Plan</th><td>${sub.plan || '—'}</td></tr>
      <tr><th>Amount</th><td>${sub.amount} ${sub.currency}</td></tr>
      <tr><th>Next Charge</th><td>${formatDate(sub.nextChargeDate)}</td></tr>
      <tr><th>Billing Cycle</th><td>${sub.intervalCount} × ${sub.billingCycle}</td></tr>
      <tr><th>Category</th><td>${sub.category || 'other'}</td></tr>
    </table>
    <p>You can pause or cancel it anytime from your dashboard if you no longer need it.</p>
    <p><a class="button" href="${process.env.CLIENT_URL || '#'}">Open Dashboard</a></p>
  `;
  const html = layout({ title: 'Subscription Renewal Reminder', body });
  return sendMail({ to, subject, html });
}

export async function notifySpendingAlert(user, period, total, threshold, currency = 'USD') {
  const subject = `Spending alert: ${total} ${currency} (${period})`;
  const to = user.email;
  const body = `
    <p>Hi ${user.name || 'there'},</p>
    <p>Your ${period} subscription spend reached <strong>${total} ${currency}</strong>, exceeding your alert threshold of <strong>${threshold} ${currency}</strong>.</p>
    <p>Consider reviewing large or unused subscriptions to optimize costs.</p>
    <p><a class="button" href="${process.env.CLIENT_URL || '#'}">Review Subscriptions</a></p>
  `;
  const html = layout({ title: 'Spending Alert', body });
  return sendMail({ to, subject, html });
}

export async function notifySubscriptionUpdated(user, sub, changed = {}) {
  const subject = `${sub.name} updated`;
  const to = user.email;
  const fields = Object.entries(changed)
    .filter(([k]) => !['updatedAt','createdAt','__v','user','userId','_id'].includes(k))
    .map(([k, v]) => `<tr><th>${k}</th><td>${String(v)}</td></tr>`)
    .join('') || '<tr><td colspan="2">(No key fields captured)</td></tr>';
  const body = `
    <p>Hi ${user.name || 'there'},</p>
    <p>Your subscription <strong>${sub.name}</strong> was updated. Details below:</p>
    <table class="meta-table">
      <tr><th>Subscription</th><td>${sub.name}</td></tr>
      <tr><th>Plan</th><td>${sub.plan || '—'}</td></tr>
      <tr><th>Amount</th><td>${sub.amount} ${sub.currency}</td></tr>
      <tr><th>Next Charge</th><td>${formatDate(sub.nextChargeDate)}</td></tr>
      <tr><th colspan="2">Changed Fields</th></tr>
      ${fields}
    </table>
    <p>If you didn’t make this change, rotate your password and review account security.</p>
    <p><a class="button" href="${process.env.CLIENT_URL || '#'}">View Subscription</a></p>
  `;
  const html = layout({ title: 'Subscription Updated', body });
  return sendMail({ to, subject, html });
}

export async function notifySubscriptionDeleted(user, subName) {
  const subject = `${subName} deleted`;
  const to = user.email;
  const body = `
    <p>Hi ${user.name || 'there'},</p>
    <p>The subscription <strong>${subName}</strong> has been removed from your account.</p>
    <p>If this was accidental, you can add it again from the dashboard.</p>
    <p><a class="button" href="${process.env.CLIENT_URL || '#'}">Add Subscription</a></p>
  `;
  const html = layout({ title: 'Subscription Deleted', body });
  return sendMail({ to, subject, html });
}

export async function notifyAdminNewUser(user) {
  const to = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!to) return false;
  const subject = `New user: ${user.email}`;
  const body = `
    <p><strong>New registration</strong></p>
    <table class="meta-table">
      <tr><th>Name</th><td>${user.name || '—'}</td></tr>
      <tr><th>Email</th><td>${user.email}</td></tr>
      <tr><th>Verified</th><td>${user.isVerified ? 'Yes' : 'No'}</td></tr>
      <tr><th>Created</th><td>${formatDate(user.createdAt)}</td></tr>
    </table>
    <p>Consider welcoming the user or monitoring early activity for feedback.</p>
  `;
  const html = layout({ title: 'New User Registered', body });
  return sendMail({ to, subject, html });
}

export async function notifyAdminSupportMessage(user, message) {
  const to = process.env.ADMIN_EMAIL || 'kdas.portfolio@gmail.com' || process.env.SMTP_USER;
  const subject = `Support: ${user.name || user.email}`;
  const safeMsg = (String(message || '')).slice(0, 5000);
  const body = `
    <p><strong>New support request</strong></p>
    <table class="meta-table">
      <tr><th>Name</th><td>${user.name || '—'}</td></tr>
      <tr><th>Email</th><td>${user.email}</td></tr>
      <tr><th>When</th><td>${new Date().toLocaleString()}</td></tr>
    </table>
    <p style="margin-top:12px;">Message:</p>
    <div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;padding:12px;border-radius:8px;">${safeMsg}</div>
  `;
  const html = layout({ title: 'Support Message', body });
  return sendMail({ to, subject, html, text: `From: ${user.name || ''} <${user.email}>
${safeMsg}` });
}
