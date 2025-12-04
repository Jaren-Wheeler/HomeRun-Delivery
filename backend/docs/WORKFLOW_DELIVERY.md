# Delivery Lifecycle & Payment Flow

This document explains how delivery jobs progress through the system and how
payments are handled securely using Stripe. Funds are **only captured when a job
is completed**, minimizing risk for both purchasers and deliverers.

---

### 1 Open — Job Created

Purchaser posts a new delivery request  
➡️ `POST /api/purchaser`

### 2 Closed — Job Accepted

Deliverer accepts a job  
➡️ `PUT /api/deliverer/:id/accept`

Stripe creates a PaymentIntent with manual capture (funds will only be charged after delivery).
This step returns a clientSecret that the frontend must use with stripe.confirmCardPayment() to attach a card.
PaymentIntent state after this step: requires_payment_method.

### 3 Completed — Job Finished

Deliverer confirms job success  
➡️ `PUT /api/deliverer/:id/complete`

Stripe **captures** the funds  
➡️ `POST /api/payments/capture/:paymentId`

---

## Cancellations & Failures

| Situation        | System Response                              |
| ---------------- | -------------------------------------------- |
| Driver backs out | Payment canceled + job returns to `open`     |
| Delivery fails   | Payment canceled + manual follow-up required |

> Stripe PaymentIntent status remains the **source of truth** for financial state.

---

## Why Manual Capture?

- Prevents charging users before jobs are fulfilled
- Automatically releases funds if a job cancels
- Enables dispute resolution **before** real money moves

---
