<div align="center">

# Subscription Tracker – Backend API
Robust REST API powering the unified subscription management dashboard.

</div>

## 1. Overview
This service provides authentication, subscription CRUD, category management, analytics virtuals (annual & INR conversions) and admin oversight.

## 2. Tech Stack
| Layer | Tech |
|-------|------|
| Runtime | Node.js (Express) |
| DB | MongoDB + Mongoose |
| Auth | JWT (access) + blacklist revocation |
| Mail | Nodemailer (SMTP or dev console) |
| Schedulers | setInterval based (simple) |

## 3. Folder Structure
```
backend/
	server.js            # entrypoint & schedulers
	db/connect.js        # mongoose connection
	models/              # User, Subscription, Category, BlacklistedToken
	controllers/         # user, admin, category, subscription logic
	routes/              # route modules
	middlewares/         # auth, errorHandler, requireAdmin, asyncHandler
	services/            # categorize.service.js, notification.service.js
	utils/mailer.js      # email abstraction
	RouteTesting.md      # detailed Postman guide
```

## 4. Environment Variables
Create `backend/.env`:
```
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/subscriptions
JWT_SECRET=supersecretchangeme
CLIENT_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=Subscription Tracker <no-reply@example.com>
ADMIN_EMAIL=
SPEND_ALERT_THRESHOLD=50
NODE_ENV=development
```
Notes:
- When SMTP vars absent, emails are logged with `[mailer.disabled]`.
- `SPEND_ALERT_THRESHOLD` triggers aggregate spend alert emails.

## 5. Install & Run
```bash
npm install
npm run dev   # nodemon
# or
npm start
```
Server default: http://localhost:5000

## 6. Authentication Flow
1. Register → user created; optional verify token in non-production
2. Login → returns `{ token, user }`
3. Authenticated requests: `Authorization: Bearer <token>`
4. Logout → token persisted to blacklist (cannot be reused)
5. Admin routes require `role: 'admin'`

## 7. Models (Key Fields)
### User
```
email (unique), passwordHash, name, phone, role (user|admin), isVerified
```
### Subscription
```
user (ref), name, amount, currency, billingCycle, intervalCount,
status (active|paused|canceled), category, provider, plan,
tags[], url, startDate, nextChargeDate, paymentMethod,
Virtuals: annualCost, amountINR, annualCostINR
```
### Category
```
name, slug, color, icon, description, isGlobal
```
### BlacklistedToken
```
token, expiresAt
```

## 8. Virtual Calculations
Annual cost normalizes any billing cycle to yearly. INR conversions use a static mapping (`RATES_TO_INR`) – replaceable with live FX.

## 9. Routes (Summary)
Full details: `RouteTesting.md`.

| Group | Base | Highlights |
|-------|------|------------|
| Health | `/health` | Service status |
| Users | `/users` | register, login (same for admin), verify, me, logout |
| Subscriptions | `/subscriptions` | CRUD owner-scoped |
| Categories | `/categories` | List (all), admin create/update/delete |
| Admin | `/admin/users` | list, get, update, delete, user subscriptions |
| Admin | `/admin/subscriptions` | global read-only list |

## 10. Error Format
```
{ "message": "Human readable error" }
```
Non-production may include stack in centralized error middleware.

## 11. Middleware Stack (Typical Request)
`auth -> requireAdmin (optional) -> controller -> errorHandler`

## 12. Notifications
Triggered by scheduler & immediate events:
- Renewal reminder (3 day window)
- Spend threshold alert (aggregate active annualized vs threshold)
- User registration (admin notice)
- Update/delete confirmations

## 13. Category Auto-Inference
`categorize.service.js` scans provider/name keywords (e.g., Netflix -> ott). Executed on create & certain updates if category omitted.

## 14. Security Notes
- JWT secret length ≥ 32 chars recommended
- Password hashing (assumed bcrypt in user model – ensure SALT rounds ~10+)
- Token blacklist prevents reuse after logout
- Input sanitation recommended (extend with validator or JOI/Zod)

## 15. Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start w/ nodemon reload |
| `npm start` | Production style start |

## 16. Testing (Manual)
Use Postman collection guided by `RouteTesting.md`. Future: add Jest + supertest for auth & subscription CRUD.

## 17. Roadmap (Backend)
| Priority | Item |
|----------|------|
| High | Replace static FX with external rates API |
| High | Password reset + email verification enforcement |
| Medium | Rate limiting (login / mutation endpoints) |
| Medium | Pagination & sorting for heavy lists |
| Medium | Webhook export / integration (e.g., budgeting apps) |
| Low | GraphQL layer / caching |
| Low | Background worker (Bull / Agenda) for scalable jobs |

---
Backend ready for extension. PRs / improvements welcome.
