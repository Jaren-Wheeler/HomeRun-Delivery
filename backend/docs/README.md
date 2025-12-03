## HomeRun Delivery Backend

This backend powers the HomeRun delivery platform, enabling:

- **Purchasers** to create delivery requests for local item pickups
- **Deliverers** to discover, accept, and complete posted jobs
- **Secure payments** through Stripe (manual capture → charge only after completion)
- **Geolocation & map-based job discovery** using Google Maps API

Designed for safety, scalability, and clear role-based workflows.

---

## Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| Runtime            | Node.js (Express)                             |
| Database           | SQLite (local development)                    |
| ORM                | Sequelize (migrations + associations)         |
| Payments           | Stripe PaymentIntents (capture on completion) |
| Maps               | Google Maps JS SDK                            |
| Architecture Style | MVC + Service Layer                           |

> SQL Server or PostgreSQL can be used in production with zero business logic changes.

---

## Architecture

The backend follows a **clean separation of concerns**, enabling easy team collaboration:

```
└── 📁backend
    └── 📁config
    └── 📁controllers
    └── 📁docs
    └── 📁middleware
    └── 📁models
    └── 📁routes
    └── 📁services
```

✔ Controllers remain thin (HTTP-specific logic only)  
✔ Services contain core logic + state transitions  
✔ Models define schema + relationships  
✔ Routes reflect **role-based** API boundaries

---

## Deployment-Ready

Environment-driven configuration ensures:

- No schema destruction in production
- Secure usage of API keys via dotenv
- Stripe keys + Maps keys **never exposed** in codebase
