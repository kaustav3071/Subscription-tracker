# Route Testing Guide (Postman)

This guide helps you test the User and Admin APIs using Postman.

Base URL
- Local: http://localhost:5000

Recommended Postman variables
- base_url = http://localhost:5000
- user_token = (set after login)
- admin_token = (set after admin login)

## Prerequisites
- Server is running
- .env has:
  - MONGO_URL, JWT_SECRET
  - Optional SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
  - CLIENT_URL (used only in the email link body)
- For email verification without SMTP, the server returns `verifyToken` in non-production (NODE_ENV != production).

Headers (common)
- Content-Type: application/json

Auth header (JWT)
- Authorization: Bearer {{user_token}}

---

## User Routes (/users)

### 1) Register
- Method: POST
- URL: {{base_url}}/users/register
- Body (raw JSON):
{
  "email": "user1@example.com",
  "password": "P@ssw0rd123",
  "name": "User One",
  "phone": "+12025550123"
}
- Success: 201
- Response includes `token` and `user`.
- If NODE_ENV != production, it also includes `verifyToken` for testing.

### 2) Verify Email
- Method: GET
- URL: {{base_url}}/users/verify-email?token={{verifyToken}}
- Success: 200 { "success": true }

Notes:
- If you configured SMTP, a verification email is sent. Otherwise, the verify link is logged to the console and `verifyToken` is returned in the register response.

### 3) Login
- Method: POST
- URL: {{base_url}}/users/login
- Body (raw JSON):
{
  "email": "user1@example.com",
  "password": "P@ssw0rd123"
}
- Success: 200 with { token, user }
- Set Postman variable `user_token` to this token.

### 4) Get Me (profile)
- Method: GET
- URL: {{base_url}}/users/me
- Headers: Authorization: Bearer {{user_token}}
- Success: 200 with user object

Alternative (must match your own ID):
- Method: GET
- URL: {{base_url}}/users/me/{{yourUserId}}
- Same header; returns 403 if ID != token user.

### 5) Logout
- Method: POST
- URL: {{base_url}}/users/logout
- Headers: Authorization: Bearer {{user_token}}
- Success: 200 { success: true }

Revocation check:
- Try calling GET /users/me again with the same token → should return 401 (Token revoked).

---

## Admin Routes (/admin)
Admin routes are protected by JWT and require a user with `role: 'admin'`.

### Promote a user to admin (one-time setup)
Use your DB tool to set `role` to `admin` for a user document. Example MongoDB shell:
- db.users.updateOne({ email: "user1@example.com" }, { $set: { role: "admin" } })

Alternatively, create a dedicated promotion endpoint (not included) or insert a user with role admin.

### Admin login (same login route as users)
- Log in as the admin user via POST /users/login.
- Set `admin_token` in Postman to that token.

Auth header for admin:
- Authorization: Bearer {{admin_token}}

### 1) List all users
- Method: GET
- URL: {{base_url}}/admin/users
- Headers: Authorization: Bearer {{admin_token}}
- Success: 200 [ user, ... ]

### 2) Get a user by ID
- Method: GET
- URL: {{base_url}}/admin/users/{{userId}}
- Headers: Authorization: Bearer {{admin_token}}
- Success: 200 user object

### 3) Update a user (name, phone, isVerified)
- Method: PUT
- URL: {{base_url}}/admin/users/{{userId}}
- Headers: Authorization: Bearer {{admin_token}}
- Body (raw JSON):
{
  "name": "Updated Name",
  "phone": "+11234567890",
  "isVerified": true
}
- Success: 200 updated user

### 4) Delete a user (optional)
- Method: DELETE
- URL: {{base_url}}/admin/users/{{userId}}
- Headers: Authorization: Bearer {{admin_token}}
- Success: 200 { success: true }

---

## Troubleshooting
- 401 Unauthorized on protected routes:
  - Missing/invalid/expired token or token was revoked via logout.
- 403 Forbidden on /users/me/:id:
  - The ID doesn’t match the authenticated user.
- Email verification not received:
  - Check console logs for the verification link.
  - Ensure SMTP_* env vars are set if you want real emails.
- Connection errors:
  - Verify MONGO_URL in .env and that MongoDB is reachable.
- Admin access denied:
  - Ensure the logged-in user document has role: 'admin'.

---

## Subscription Routes (/subscriptions)
All subscription routes require a logged-in user (JWT). Each request must include:
- Authorization: Bearer {{user_token}}

Supported fields (high level)
- name (string, required), amount (number, required; you can also send "cost"), currency (ISO 3-letter, e.g., USD)
- billingCycle: daily | weekly | monthly | quarterly | yearly | custom (default monthly)
- intervalCount (number, default 1)
- startDate (date), nextChargeDate (date; auto-computed if missing), category, tags[], url, provider, plan, description, accountEmail, paymentMethod

### 1) Create a subscription
- Method: POST
- URL: {{base_url}}/subscriptions
- Headers: Authorization: Bearer {{user_token}}
- Body (raw JSON):
{
  "name": "Netflix",
  "amount": 15.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "intervalCount": 1,
  "category": "entertainment",
  "provider": "Netflix",
  "plan": "Standard",
  "url": "https://www.netflix.com",
  "accountEmail": "user1@example.com"
}
- Alternative: you may send `cost` instead of `amount` and it will be mapped automatically.
- Success: 201 with created subscription

### 2) List my subscriptions
- Method: GET
- URL: {{base_url}}/subscriptions
- Optional query: `?status=active|paused|canceled`
- Headers: Authorization: Bearer {{user_token}}
- Success: 200 [ subscription, ... ] (only the caller's subscriptions)

### 3) Get one subscription by ID
- Method: GET
- URL: {{base_url}}/subscriptions/{{subscriptionId}}
- Headers: Authorization: Bearer {{user_token}}
- Success: 200 subscription object (404 if not found or not owned by caller)

### 4) Update a subscription
- Method: PUT
- URL: {{base_url}}/subscriptions/{{subscriptionId}}
- Headers: Authorization: Bearer {{user_token}}
- Body (raw JSON):
{
  "amount": 17.99,
  "billingCycle": "monthly",
  "category": "entertainment",
  "tags": ["video", "streaming"]
}
- Notes: you cannot change ownership; `user`/`userId` updates are ignored.
- Success: 200 with updated subscription (404 if not found/not owned)

### 5) Delete a subscription
- Method: DELETE
- URL: {{base_url}}/subscriptions/{{subscriptionId}}
- Headers: Authorization: Bearer {{user_token}}
- Success: 200 { "success": true } (404 if not found/not owned)

### Extra tips
- nextChargeDate is auto-computed from startDate + billingCycle + intervalCount if you omit it.
- The response includes a virtual `annualCost` to help with dashboards.

---

## Category Routes (/categories)
All category endpoints require a logged-in user. You’ll receive both global default categories and your personal ones.

### 1) List categories
- Method: GET
- URL: {{base_url}}/categories
- Headers: Authorization: Bearer {{user_token}}
- Success: 200 [ category, ... ]

### 2) Create a category
- Method: POST
- URL: {{base_url}}/categories
- Headers: Authorization: Bearer {{user_token}}
- Body (raw JSON):
{
  "name": "OTT",
  "slug": "ott",
  "color": "#F59E0B",
  "icon": "mdi:television-classic",
  "description": "Streaming platforms"
}
- Success: 201 with created document

### 3) Update a category
- Method: PATCH
- URL: {{base_url}}/categories/{{categoryId}}
- Headers: Authorization: Bearer {{user_token}}
- Body: partial fields to update
- Success: 200 with updated document

### 4) Delete a category
- Method: DELETE
- URL: {{base_url}}/categories/{{categoryId}}
- Headers: Authorization: Bearer {{user_token}}
- Note: You can only delete your own categories (not global defaults)
- Success: 200 { success: true }

### Auto-categorization
- If you omit `category` when creating a subscription, it will be inferred using provider/name keywords.
  - Examples that map to `ott`: Netflix, Hotstar, Prime Video, JioCinema
  - Examples that map to `gaming`: Xbox Game Pass, PlayStation Plus
- On update, if you change the name/provider but don’t set category, we re-run inference.

---

## Notifications (how to test)

Two modes:
- With SMTP configured: Real emails are sent.
- Without SMTP: We log a line like `[mailer.disabled] { to, subject }` to the server console instead of sending.

SMTP setup (optional but recommended)
- Use a test SMTP provider like Ethereal or Mailtrap.
- Set these in `.env` and restart the server:
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
  - For admin notifications also set ADMIN_EMAIL (fallback is SMTP_USER).

What triggers notifications
1) Renewal reminder (email to user)
   - Triggered by a background scheduler that looks for subscriptions due in ~3 days (status: active, nextChargeDate between now and +3 days).
   - Steps to test:
     - Create a subscription with `nextChargeDate` within the next 3 days.
       Example body for POST /subscriptions:
       {
         "name": "Netflix",
         "amount": 10,
         "currency": "USD",
         "billingCycle": "monthly",
         "intervalCount": 1,
         "nextChargeDate": "<ISO date 2 days from now>"
       }
     - Wait for the scheduler to run (by default it runs about every 12 hours).
     - Optional (faster for dev only): temporarily change the scheduler interval in `server.js` from 12 hours to ~30 seconds, test, then revert.

2) Spending alert (email to user)
   - Scheduler sums active subscriptions and compares to `SPEND_ALERT_THRESHOLD` (env, default 50).
   - Steps to test:
     - Set a low threshold in `.env`, e.g., `SPEND_ALERT_THRESHOLD=1`, and restart.
     - Ensure you have at least one active subscription with `amount > 1`.
     - Wait for the scheduler run (or use the temporary faster interval as above).

3) Subscription updated (email to user)
   - Immediate on successful update.
   - Steps to test:
     - PUT /subscriptions/{{id}} with a change, e.g., `{ "amount": 12.34 }`.
     - Check your email (SMTP) or server logs for `[mailer.disabled]` output.

4) Subscription deleted (email to user)
   - Immediate on successful delete.
   - Steps to test:
     - DELETE /subscriptions/{{id}}
     - Check your email/logs.

5) Admin new user notification (email to admin)
   - Sent on successful user registration if `ADMIN_EMAIL` or `SMTP_USER` is set.
   - Steps to test:
     - Set `ADMIN_EMAIL` in `.env`.
     - Register a new user via POST /users/register.
     - Check the admin inbox (SMTP) or logs.

Troubleshooting
- No emails arriving:
  - Confirm SMTP_* vars are set and correct; check server console for transport errors.
  - If not using SMTP, look for `[mailer.disabled]` lines which include `to` and `subject`.
- Scheduler didn’t send reminders/alerts:
  - Ensure the data matches the criteria (nextChargeDate within 3 days; status active).
  - Lower the interval temporarily during development to avoid long waits.
  - Confirm server time and your dates (use ISO timestamps in UTC).
