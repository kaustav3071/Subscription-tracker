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
