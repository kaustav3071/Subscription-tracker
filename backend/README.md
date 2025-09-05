# Subscription Tracker Backend

Simple Express + MongoDB API for managing user subscriptions.

## Env
Copy `.env.example` to `.env` and set values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/subscriptions
JWT_SECRET=supersecretchangeme
```

## Scripts
- `npm run dev` – start with nodemon
- `npm start` – start with node

## Endpoints
- `GET /api/health`
- `POST /api/auth/register` { email, password, name }
- `POST /api/auth/login` { email, password }
- `GET /api/subscriptions` (auth)
- `POST /api/subscriptions` (auth)
- `GET /api/subscriptions/:id` (auth)
- `PUT /api/subscriptions/:id` (auth)
- `DELETE /api/subscriptions/:id` (auth)
