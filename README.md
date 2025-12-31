<div align="center">

# 💰 Subscription Tracker Dashboard

### *Your Financial Command Center for Recurring Payments*

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/kaustav3071)
[![Hackathon](https://img.shields.io/badge/Hackathon-Mind%20Sprint%202025-blue.svg)](https://github.com/kaustav3071/Subscription-tracker)
[![Solo Project](https://img.shields.io/badge/Project%20Type-Solo-orange.svg)](https://github.com/kaustav3071)
[![Built in 48h](https://img.shields.io/badge/Built%20in-48%20Hours-green.svg)](https://github.com/kaustav3071/Subscription-tracker)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Stop letting subscriptions drain your wallet.** Track, analyze, and optimize every recurring charge in one beautiful dashboard.

[✨ Features](#-core-features) • [🚀 Quick Start](#-quick-start) • [🛠️ Tech Stack](#️-tech-stack) • [📸 Screenshots](#-screenshots)

---

![Dashboard Preview](https://via.placeholder.com/900x500/6366F1/FFFFFF?text=📊+Beautiful+Dashboard+•+Real-time+Analytics+•+Smart+Insights)

</div>

---

## 🎯 The Problem

In today's subscription economy, the average person manages **20+ recurring charges**. The result? Financial chaos:

- 💸 **Hidden spend creep** — "small" monthly fees silently stack to thousands annually
- 📅 **Renewal surprises** — no central calendar means unexpected charges hit your account
- 📊 **Zero visibility** — scattered spreadsheets that are outdated the moment you create them  
- 🌍 **Currency confusion** — comparing $9.99, ₹799, and €7.49 subscriptions? Good luck.
- 🔕 **No alerts** — miss a cancellation window and you're charged for another year

> *"I thought I was spending $50/month on subscriptions. Turns out it was $247."* — Every user ever

---

## 💡 The Solution

**Subscription Tracker** is your intelligent subscription intelligence platform that brings clarity to chaos:

### 🎨 What Makes It Special

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Unified Dashboard     │  🔔 Smart Notifications         │
│  Real-time KPIs & Charts  │  Renewal & spend threshold     │
├─────────────────────────────────────────────────────────────┤
│  💱 Currency Normalization │  🤖 Auto-Categorization        │
│  All amounts → Base (INR)  │  AI-powered tagging            │
├─────────────────────────────────────────────────────────────┤
│  📈 Annual Cost Insights   │  👑 Admin Control Panel        │
│  See the real impact       │  Multi-user management         │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### 👤 **User Experience**

<table>
<tr>
<td width="50%">

#### 🔐 **Authentication & Security**
- 📧 Email verification with beautiful HTML templates
- 🔑 JWT-based authentication
- 🚫 Token blacklist for secure logout
- 👤 Profile management with live statistics

</td>
<td width="50%">

#### 📊 **Dynamic Dashboard**
- 📈 Real-time KPIs (Total, Active, Annual Spend)
- 🎨 Chart.js visualizations (Bar & Doughnut)
- 🎯 Top 5 spenders at a glance
- 🏷️ Category breakdown with color coding

</td>
</tr>
<tr>
<td width="50%">

#### 💳 **Subscription Management**
- ➕ Create with auto-categorization
- ✏️ Edit & update seamlessly  
- 🗑️ Delete with confirmation
- 🔍 Filter by status/category
- 🔄 Support all billing cycles

</td>
<td width="50%">

#### 💰 **Financial Intelligence**
- 💱 Multi-currency support (auto-convert to INR)
- 📅 Annual cost normalization
- 🎯 Monthly equivalent calculations
- 🔔 Spending threshold alerts
- ⏰ Renewal reminders (3-day window)

</td>
</tr>
</table>

### 👑 **Admin Control Panel**

```
🎛️  User Management       → List, view, update, delete users
📊  Global Analytics       → Cross-user subscription insights
🏷️  Category Management    → Create, update, delete categories
👥  User Drill-down        → View any user's subscriptions
📮  Support System         → Ticket management & replies
```

### 🎨 **Design Excellence**

| Feature | Implementation |
|---------|----------------|
| 🎭 **UI Framework** | Glass morphism + gradient overlays |
| 🌓 **Dark Mode** | Full theme support with smooth transitions |
| 📱 **Responsive** | Mobile-first design, works on all devices |
| ⚡ **Performance** | Optimized renders with React best practices |
| 🎪 **Animations** | Subtle hover effects & micro-interactions |
| 🎨 **Typography** | Carefully chosen font scales & weights |

---

## 🛠️ Tech Stack

<div align="center">

### **Frontend Powerhouse**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### **Backend Infrastructure**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 7, React Router 7, TailwindCSS 4, Chart.js |
| **State Management** | React Context API + JWT in localStorage |
| **Backend** | Node.js 18+, Express 5, Mongoose ODM |
| **Database** | MongoDB (local or Atlas) |
| **Authentication** | JWT with blacklist revocation |
| **Email Service** | Nodemailer (SMTP configurable) |
| **Dev Tools** | ESLint 9, PostCSS, Autoprefixer |

---

## 🚀 Quick Start

### Prerequisites

```bash
✅ Node.js 18+ 
✅ MongoDB (local or Atlas)
✅ Git
```

### Installation

```bash
# Clone the repository
git clone https://github.com/kaustav3071/Subscription-tracker.git
cd Subscription-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

Create `backend/.env`:

```env
# Database
MONGO_URL=mongodb://localhost:27017/subscriptions

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email (Optional - falls back to console logging)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=Subscription Tracker <no-reply@example.com>

# Admin
ADMIN_EMAIL=admin@example.com
```

### Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm start
# 🚀 Server running on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# ⚡ Frontend running on http://localhost:5173
```

### Create Admin User (Optional)

```bash
cd backend
node scripts/createAdmin.js
```

---

## 📸 Screenshots

<div align="center">

### 📊 Dashboard Overview
![Dashboard](https://via.placeholder.com/800x450/6366F1/FFFFFF?text=Dashboard+•+KPIs+•+Charts+•+Insights)

### 💳 Subscription Management
![Subscriptions](https://via.placeholder.com/800x450/EC4899/FFFFFF?text=Manage+Subscriptions+•+Filter+•+Search)

### 👤 User Profile
![Profile](https://via.placeholder.com/800x450/8B5CF6/FFFFFF?text=Profile+•+Stats+•+Preferences)

### 👑 Admin Panel
![Admin](https://via.placeholder.com/800x450/F59E0B/FFFFFF?text=Admin+Dashboard+•+User+Management)

</div>

---

## 📊 Data Models

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  role: "user" | "admin",
  isVerified: Boolean,
  notifications: {
    renewalReminders: Boolean,
    spendingAlerts: Boolean,
    reminderDaysBefore: Number,
    spendingThreshold: Number,
    currency: String
  }
}
```

### Subscription Model
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  amount: Number,
  currency: String,
  billingCycle: "daily"|"weekly"|"monthly"|"quarterly"|"yearly"|"custom",
  intervalCount: Number,
  status: "active"|"paused"|"canceled",
  category: String,
  provider: String,
  plan: String,
  tags: [String],
  startDate: Date,
  nextChargeDate: Date,
  paymentMethod: String,
  // Virtuals
  annualCost: Number (computed),
  amountINR: Number (computed),
  annualCostINR: Number (computed)
}
```

---

## 🎯 API Endpoints

### Authentication
```http
POST   /users/register          # Create new account
POST   /users/login             # Login user
POST   /users/logout            # Logout & blacklist token
GET    /users/verify-email      # Verify email token
POST   /users/resend-verification
GET    /users/me                # Get current user
```

### Subscriptions
```http
GET    /subscriptions           # List user subscriptions
POST   /subscriptions           # Create subscription
GET    /subscriptions/:id       # Get single subscription
PUT    /subscriptions/:id       # Update subscription
DELETE /subscriptions/:id       # Delete subscription
```

### Categories
```http
GET    /categories              # List all categories
POST   /categories              # Create category (admin)
PATCH  /categories/:id          # Update category (admin)
DELETE /categories/:id          # Delete category (admin)
```

### Admin
```http
GET    /admin/users             # List all users
GET    /admin/users/:id         # Get user details
PUT    /admin/users/:id         # Update user
DELETE /admin/users/:id         # Delete user
GET    /admin/users/:id/subscriptions
GET    /admin/subscriptions     # Global subscription view
GET    /admin/support           # Support tickets
POST   /admin/support/:id/reply # Reply to ticket
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| 🔒 **Password Hashing** | bcrypt with salt rounds |
| 🎫 **JWT Authentication** | Signed tokens with expiry |
| 🚫 **Token Revocation** | Blacklist on logout |
| 🛡️ **Role-Based Access** | Middleware guards for admin routes |
| 🔍 **Input Validation** | Express-validator + Mongoose schemas |
| 🚦 **Rate Limiting** | Express-rate-limit on auth routes |
| 🔐 **NoSQL Injection Protection** | Custom sanitization middleware |
| 🎭 **Security Headers** | Helmet.js integration |

---

## 📈 Key Metrics & Analytics

### Computed Metrics
- **Annual Cost**: Normalizes any billing cycle to yearly equivalent
- **Monthly Spend**: Annual cost ÷ 12
- **Currency Conversion**: Static rates (extendable to live FX API)
- **Upcoming Renewals**: Subscriptions due in next 30 days
- **Category Breakdown**: Top 6 categories by count

### Notification System
- **Renewal Reminders**: 3-day advance notification
- **Spending Alerts**: Threshold-based monthly alerts
- **Admin Notifications**: New user registrations
- **Email Templates**: Beautiful HTML emails with branding

---

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── Layout.jsx       # App layout wrapper
│   │   ├── NavBar.jsx       # Navigation component
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Login.jsx        # Auth pages
│   │   ├── Profile.jsx      # User profile
│   │   ├── SubscriptionsPage.jsx
│   │   └── AdminDashboard.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── services/
│   │   ├── api.js           # Axios instance
│   │   ├── subscriptionApi.js
│   │   └── adminApi.js
│   └── hooks/
│       └── useDocumentTitle.js

backend/
├── controllers/         # Request handlers
├── models/             # Mongoose schemas
├── routes/             # Route definitions
├── middlewares/        # Auth, error handlers
├── services/
│   ├── categorize.service.js
│   └── notification.service.js
├── utils/
│   └── mailer.js       # Email utilities
└── scripts/
    └── createAdmin.js  # Admin user creation
```

---

## 🗺️ Roadmap

### 🚀 High Priority
- [ ] Password reset & 2FA (OTP via email)
- [ ] Live FX conversion API integration
- [ ] Export data (CSV, Excel, PDF reports)
- [ ] Spend trend visualization (time-series)

### 📊 Medium Priority
- [ ] Pagination for large datasets
- [ ] Advanced filtering & tag management
- [ ] Budget goals & alerts
- [ ] Multi-language support (i18n)

### 💡 Nice to Have
- [ ] Mobile PWA (installable app)
- [ ] ML-based cancellation suggestions
- [ ] Receipt scanning & auto-import
- [ ] Browser extension for quick adds
- [ ] Shared family/team plans

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 🐛 Known Issues & Limitations

- ⚠️ Currency conversion uses static rates (needs live API)
- ⚠️ No pagination on subscription lists (performance on 1000+ items)
- ⚠️ Charts limited to Bar & Doughnut (can expand)
- ⚠️ Manual admin role promotion (no UI yet)
- ⚠️ No 2FA / password reset implemented

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kaustav Das**

- GitHub: [@kaustav3071](https://github.com/kaustav3071)
- Email: kdas.portfolio@gmail.com

---

## 🙏 Acknowledgments

- Built for **Mind Sprint 48-Hour International Hackathon**
- Inspired by the need for better personal finance management
- Thanks to the open-source community for amazing tools

---

## 💻 Development Notes

### Running Tests (Future)
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend (uses Node directly)
cd backend
NODE_ENV=production npm start
```

### Database Seeding
```bash
# Create default categories
node backend/scripts/seedCategories.js

# Create test data
node backend/scripts/seedTestData.js
```

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

**Made with** 💜 **focus, caffeine, and 48 hours of compressed time**

[![Star on GitHub](https://img.shields.io/github/stars/kaustav3071/Subscription-tracker?style=social)](https://github.com/kaustav3071/Subscription-tracker)
[![Fork on GitHub](https://img.shields.io/github/forks/kaustav3071/Subscription-tracker?style=social)](https://github.com/kaustav3071/Subscription-tracker/fork)

---

**[⬆ back to top](#-subscription-tracker-dashboard)**

</div>
