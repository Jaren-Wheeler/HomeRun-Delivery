# REST API Overview

## Summary

The HomeRun REST API drives the core workflow of our delivery platform:

- Users can register and log in
- Purchasers can create delivery jobs
- Deliverers can view, accept, and complete jobs
- Stripe payments are authorized and captured securely based on job completion
- A map UI retrieves available jobs as geographic markers

All endpoints follow REST conventions, return JSON responses, and enforce clear system transitions from **open → claimed → completed**.

Base URL (local development):

---

---

## Authentication (`/account`)

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/account`       | Register a new user         |
| POST   | `/account/login` | Login and receive user info |

---

## Map Services (`/maps`)

| Method | Endpoint         | Description                                  |
| ------ | ---------------- | -------------------------------------------- |
| GET    | `/maps/maps-key` | Retrieve Google Maps API key (frontend-safe) |
| GET    | `/maps/markers`  | Get open jobs formatted for map markers      |

---

## Deliverer Endpoints (`/deliverer`)

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | `/deliverer/:id/pending`   | View open jobs available to accept |
| GET    | `/deliverer/:id/completed` | View completed delivery history    |
| PUT    | `/deliverer/:id/complete`  | Mark accepted job as completed     |
| PUT    | `/deliverer/:id/accept`    | Accept a delivery job              |

_State transitions enforced_
open → closed → completed

---

## Purchaser Endpoints (`/purchaser`)

| Method | Endpoint                 | Description                                       |
| ------ | ------------------------ | ------------------------------------------------- |
| GET    | `/purchaser/:id/pending` | View unclaimed delivery jobs created by purchaser |
| POST   | `/purchaser`             | Create a new delivery job request                 |

Purchaser-created deliveries start at:
status: open

---

## Payment Endpoints (`/payments`)

| Method | Endpoint                              | Description                        |
| ------ | ------------------------------------- | ---------------------------------- |
| POST   | `/payments/create-intent/:deliveryId` | Authorize funds but do not charge  |
| POST   | `/payments/capture/:paymentId`        | Capture funds after job completion |
| POST   | `/payments/cancel/:paymentId`         | Cancel and release authorization   |

⚙ Powered by Stripe using:
capture_method: manual

---

---

## Notes

- All endpoints respond with JSON
- Authorization should be added for protected operations
- Validations occur in controller/service layer
- Designed for scalability and clean separation of user roles

---
