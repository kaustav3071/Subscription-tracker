<div align="center">

# Subscription Tracker – Frontend
Modern, responsive dashboard for managing and analyzing recurring subscriptions.

</div>

## 1. Overview
This React (Vite) client consumes the backend API to provide a consolidated view of user subscriptions, spend analytics, category insights, and admin management tools.

## 2. Key Features
| Area | Features |
|------|----------|
| Auth | Register, Login, Email verification (backend), Protected routes, Logout |
| Dashboard | KPI stats, Annual & Monthly INR spend, Top Spend Bar Chart, Category Doughnut Chart |
| Subscriptions | List, Search, Filter (status), Create, Edit, Delete, Annual INR conversions, Auto-category hints |
| Profile | Modern layout, subscription stats, account & security sections, insights panel |
| Admin | User list & detail edit, per-user subscription view, global subscriptions, category management |
| UX | Dark-mode friendly styles, gradients, glassmorphism, micro-interaction hovers |
| Misc | `useDocumentTitle` hook, reusable UI primitives, responsive layout |

## 3. Tech Stack
| Purpose | Library |
|---------|---------|
| Framework | React 19 + Vite |
| Routing | React Router DOM 7 |
| Charts | Chart.js 4 + react-chartjs-2 |
| Styling | Tailwind CSS 4 + custom gradients + tailwind-merge |
| HTTP | Axios (service abstraction) |
| Forms (where used) | react-hook-form (prepared) |

## 4. Project Structure
```
src/
	main.jsx            # App bootstrap
	App.jsx             # Route definitions
	components/         # Layout, NavBar, Footer, composable UI elements
	pages/              # Dashboard, Auth, Profile, Subscriptions, Admin modules
	context/AuthContext.jsx  # Auth state + token handling
	services/           # api.js (axios instance), subscriptionApi, admin/category services
	hooks/useDocumentTitle.js
	lib/utils.js        # helpers (e.g., className merge)
	assets/             # static assets
```

## 5. Environment & API Base
The axios instance (`services/api.js`) expects the backend at `http://localhost:5000`. If deploying, expose an environment variable (e.g., `VITE_API_URL`) and update the api client accordingly.

## 6. Running Locally
```bash
npm install
npm run dev
```
Visit: http://localhost:5173

## 7. Authentication Handling
- JWT stored (likely localStorage) after login
- AuthContext hydrates user on app load
- ProtectedRoute wrapper gates internal pages
- Logout clears token & calls backend revocation

## 8. Charts
- Bar (Top Spend): Shows highest INR amounts across subscriptions
- Doughnut (Categories): Distribution of top 6 categories
- Chart.js components registered once to avoid canvas reuse errors

## 9. INR & Annual Cost Display
The backend provides virtual fields (`amountINR`, `annualCostINR`). Fallback logic ensures no crashes when values absent. Annual spend aggregated for stats & per-sub average.

## 10. Adding a New Page
1. Create file in `src/pages/YourPage.jsx`
2. Add route in `App.jsx`
3. (Optional) use `useDocumentTitle('Your Page')`
4. Consume services via existing `api` abstraction

## 11. Services Pattern
Example (`subscriptionApi`):
```js
list: (params) => api.get('/subscriptions', { params }).then(r => r.data)
```
Keeps components lean & standardizes error handling.

## 12. UI / Styling Conventions
- Prefer semantic containers with utility classes
- Gradient text for primary headings
- Glass effect: `bg-white/60 dark:bg-gray-900/60 backdrop-blur border border-gray-200/70`
- Status chips: color-coded per state (`active`, `paused`, `canceled`)

## 13. Admin Specific UI
- Conditional rendering: `user.role === 'admin'`
- Additional routes: `/admin/users/:id`, `/admin/users/:id/subscriptions`, `/admin/subscriptions`
- Restricted actions (no create/edit buttons on global admin subscription list)

## 14. Hooks
`useDocumentTitle(title, { siteName, separator })` – small helper to unify title formatting.

## 15. Error Handling Pattern
Each async load sets `loading`, catches `e.response?.data?.message || e.message`, and displays small red text or fallback skeleton.

## 16. Extending / Ideas
| Category | Idea |
|----------|------|
| Charts | Monthly trend line (spend over time), Stacked by category |
| UX | Toast notifications (success/error) |
| Performance | Code-split heavy admin pages |
| State | Migrate to TanStack Query for caching |
| Accessibility | Keyboard focus outlines & ARIA roles audit |
| Offline | PWA manifest + service worker |

## 17. Testing Strategy (Future)
- Component tests (React Testing Library) for critical forms
- Integration: mock axios to validate page flows
- Visual regression optional (Storybook + Chromatic later)

## 18. Deployment Notes
- Build: `npm run build` → `dist/`
- Serve behind CDN / static host (Vercel, Netlify, S3+CloudFront)
- Set API origin via environment (e.g., `VITE_API_URL`) at build time

## 19. Known Limitations
- No pagination on large tables
- Manual admin promotion (no UI wizard)
- Minimal optimistic UI for deletions (basic state removal only)
- No central toast/alert system yet

## 20. License
MIT (match root project).

---
Polished UI for clear subscription intelligence. Contributions / suggestions welcome.
