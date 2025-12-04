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

## Authentication (`/api/account`)

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/account/register` | Register a new user         |
| POST   | `/api/account/login`    | Login and receive user info |

---

## Map Services (`/api/maps`)

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/api/maps/maps-key` | Retrieve Google Maps API key (frontend-safe) |
| GET    | `/api/maps/markers`  | Get open jobs formatted for map markers      |

---

## Deliverer Endpoints (`/api/deliverer`)

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| GET    | `/api/deliverer/:id/pending`   | View open jobs available to accept |
| GET    | `/api/deliverer/:id/completed` | View completed delivery history    |
| PUT    | `/api/deliverer/:id/complete`  | Mark accepted job as completed     |
| PUT    | `/api/deliverer/:id/accept`    | Accept a delivery job              |

_State transitions enforced_
open → closed → completed

---

## Purchaser Endpoints (`/api/purchaser`)

| Method | Endpoint                     | Description                                       |
| ------ | ---------------------------- | ------------------------------------------------- |
| GET    | `/api/purchaser/:id/pending` | View unclaimed delivery jobs created by purchaser |
| POST   | `/api/purchaser`             | Create a new delivery job request                 |

Purchaser-created deliveries start at:
status: open

---

## Payment Endpoints (`/api/payments`)

| Method | Endpoint                                  | Description                        |
| ------ | ----------------------------------------- | ---------------------------------- |
| POST   | `/api/payments/create-intent/:deliveryId` | Authorize funds but do not charge  |
| POST   | `/api/payments/capture/:paymentId`        | Capture funds after job completion |
| POST   | `/api/payments/cancel/:paymentId`         | Cancel and release authorization   |

⚙ Powered by Stripe using:

- `capture_method: manual` (funds only move after job completion)
- PaymentIntent returned with a `clientSecret` that must be confirmed in the frontend using `stripe.confirmCardPayment()`

---

---

## Notes

- All endpoints respond with JSON
- Authorization should be added for protected operations
- Validations occur in controller/service layer
- Designed for scalability and clean separation of user roles

---
