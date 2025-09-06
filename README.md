<div align="center">

# Subscription Tracker Dashboard
All your recurring subscriptions – organized, analyzed, optimized.

Hackathon: **Mind Sprint – 48-Hour International Hackathon**  
Author: **Solo Project (Kaustav)**

</div>

---

## 1. Problem Statement
Modern users juggle dozens of recurring charges: streaming, gaming, SaaS tools, cloud credits, news, productivity, education and micro‑subscriptions. These issues emerge:
- Hidden spend creep ("small" monthly fees stacking silently)
- No central visibility of renewal dates → failed budgeting / surprise charges
- Manual tracking in spreadsheets is error‑prone & never up to date
- Hard to categorize & compare real annualized cost impact
- Lack of proactive notifications (renewals, spend thresholds)

## 2. Idea / Solution
A unified subscription intelligence platform that:
1. Centralizes every recurring charge with rich metadata
2. Normalizes billing cycles & converts amounts to a base currency (INR)
3. Computes annual & monthly equivalents for spend clarity
4. Surfaces category breakdown, top spenders & upcoming renewals
5. Notifies users (email) about renewals + anomalous spend thresholds
6. Equips admins with oversight (user management + cross‑user audits)

## 3. Core Features (Implemented)
### User
- Register / Login / JWT auth (email verification support)
- Profile with live stats (total, active, annual spend)
- Dynamic Dashboard: KPIs, Top Spend (Chart.js), Category Distribution (Doughnut)
- Create / Read / Update / Delete subscriptions
- Intelligent auto‑categorization (inference from name/provider)
- Currency normalization to INR + virtual annual cost fields
- Real‑time filtering & search (status/category)
- Secure logout with token blacklist revocation

### Admin
- Promote user (manual DB step) & login with same route
- Admin Dashboard (global stats – extendable)
- Manage users: list, view, update (name / phone / verification), delete
- View a specific user’s subscriptions (/admin/users/:id/subscriptions)
- Global subscription list (read‑only) with user association
- Category management (create/update/delete for admin scope)

### System / Backend
- Mongoose models with virtuals: `annualCost`, `annualCostINR`, `amountINR`
- Email service (SMTP or dev no‑SMTP fallback -> console logging)
- Scheduled tasks (renewal reminders, spend threshold alerts)
- Token blacklist for logout security
- Granular middleware: auth, admin guard, async error wrapper

## 4. Nice Touches
- Modern glass/gradient UI (Tailwind + custom components)
- Responsive layout & dark mode friendly color tokens
- Hover micro‑interactions, subtle shadows, soft borders
- Reusable hook: `useDocumentTitle` for dynamic page titles
- INR spend insights (annual & per‑subscription averages)
- Chart.js visualizations replacing static tables

## 5. Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React (Vite), React Router, Tailwind CSS, Chart.js (react-chartjs-2) |
| State/Auth | Context (AuthContext) + JWT in localStorage |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Email | Nodemailer (SMTP / disabled dev logger) |
| Auth | JWT (access) + blacklist revocation |
| Styling Utilities | tailwind-merge, custom gradient tokens |

## 6. Domain Model (Simplified)
### User
```
email, passwordHash, name, phone, role (user|admin), isVerified, createdAt
```
### Subscription
```
user -> User ref
name, amount, currency
billingCycle (daily|weekly|monthly|quarterly|yearly|custom)
intervalCount
status (active|paused|canceled)
category, provider, plan, tags[], url
startDate, nextChargeDate
paymentMethod (card|upi|netbanking|paypal|cash|other)
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

## 7. API Highlights
See `backend/RouteTesting.md` for detailed Postman guide. Key groups:
- `/users` (register, verify, login, me, logout)
- `/subscriptions` (CRUD + filtering by status)
- `/categories` (list + admin mutations)
- `/admin/users` (list/get/update/delete) & `/admin/users/:id/subscriptions`
- `/admin/subscriptions` (global view)

## 8. Derived Metrics Logic
- Annual cost = normalizes any billing cycle to yearly equivalent
- INR conversion uses static rate map (placeholder for live FX)
- Monthly spend = annual / 12
- Upcoming renewals = nextChargeDate within next 30 days & active
- Category breakdown counts top N categories for chart (currently 6)

## 9. Architecture Overview
```
frontend/
	src/
		pages/          # Dashboard, Auth, Subscriptions CRUD, Admin screens
		context/        # AuthContext
		services/       # api abstraction (axios)
		hooks/          # useDocumentTitle
backend/
	controllers/     # user, admin, subscription, category
	models/          # mongoose schemas + virtuals
	routes/          # modular route definitions
	middlewares/     # auth, asyncHandler, admin guard, error handler
	services/        # categorize, notification/email
	utils/           # mailer abstraction
```

## 10. Setup & Running Locally
### Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)

### Environment
Create `backend/.env`:
```
MONGO_URL=mongodb://localhost:27017/subscriptions
JWT_SECRET=supersecret
CLIENT_URL=http://localhost:5173
SMTP_HOST= # optional
SMTP_PORT= # optional
SMTP_USER= # optional
SMTP_PASS= # optional
MAIL_FROM=Subscription Tracker <no-reply@example.com>
SPEND_ALERT_THRESHOLD=50
```

### Install & Run
```powershell
# Backend
cd backend
npm install
npm start

# Frontend (in separate terminal)
cd ../frontend
npm install
npm run dev
```
Frontend: http://localhost:5173  
Backend API: http://localhost:5000


## 11. Security Considerations
- Passwords hashed (bcrypt) (assumed in model implementation)
- JWT revocation via blacklist on logout
- Role-based route protection (middleware + frontend guard)
- Input validation (basic) – can be extended with Joi/Zod

## 12. Email & Notifications
Modes:
- SMTP configured → real emails
- Dev fallback → console logs with `[mailer.disabled]`
Jobs:
1. Renewal reminder (3‑day window)
2. Spend threshold alert (SPEND_ALERT_THRESHOLD)
3. User registration admin notification
4. Update & deletion confirmations

## 13. Current Limitations / Trade‑offs
- Static FX conversion rates (no live API)
- No pagination on large subscription lists yet
- Charts limited to bar + doughnut (can add time‑series)
- No 2FA / password reset flow implemented yet
- Manual admin promotion (no UI for role elevate)

## 14. Roadmap (Next Steps)
| Priority | Item |
|----------|------|
| High | Password reset + 2FA (email / OTP) |
| High | Live FX conversion API integration |
| Medium | Export (CSV / Excel) & PDF reports |
| Medium | Spend trend line chart (monthly aggregated) |
| Medium | Pagination & sorting for admin tables |
| Medium | Tag cloud & advanced filtering |
| Low | Mobile PWA (installable + offline cache) |
| Low | Budget goals & alerting rules builder |
| Low | ML-based cancellation suggestions |

## 15. Development Notes
- Use `RouteTesting.md` for manual API verification
- Consistent ID fallback: `s.id || s._id` to avoid undefined route params
- Charts registered once to avoid “Canvas already in use” errors
- Tailwind utility grouping favors readability over minimal size (can future optimize)

## 16. Screens (Conceptual Summary)
- Dashboard: KPI tiles + charts (Top Spend bar, Category doughnut)
- Subscriptions List: filter, status pills, inline actions
- Subscription Create/Edit: form with auto-category inference
- Profile: gradient header, stats, account + security sections
- Admin: user management, per-user subscriptions viewer, global subscriptions

## 17. Hackathon Reflection
Built end‑to‑end within a 48‑hour sprint as a solo effort. Focused on:
- Delivering functional breadth (auth, CRUD, analytics, admin tooling) quickly
- Clean UX with modern aesthetic (glass + gradient) for demo impact
- Extensible backend (virtuals + service layer separation)
Future polishing post‑hackathon can harden validation, add test coverage, and refine performance.

## 18. Contributing (Post‑Hackathon)
Suggestions & issues welcome. For now: fork, create feature branch, open PR.

---

Made with focus, caffeine, and compressed time. 🚀

