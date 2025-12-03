# Environment Setup

This backend uses a local `.env` file to store secrets and configuration  
(Stripe key, Maps key, ports, etc). This file is **not committed to Git** and  
must be created on each developer’s machine.

---

## 1. Create `.env` in `/backend`

In the `backend` folder, create a file named `.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Stripe (server-side secret key)
STRIPE_SECRET_KEY=sk_test_your_key_here

# Google Maps
GOOGLE_MAPS_API_KEY=your_maps_key_here
```

For production, these values should come from the hosting environment
(cloud env vars) instead of a .env file.

### 2. Install dependencies

cd backend
npm install

### 3. Run the backend

npm start or node server.js

On first run, a local SQLite database file will be created at:

backend/database.sqlite

---
