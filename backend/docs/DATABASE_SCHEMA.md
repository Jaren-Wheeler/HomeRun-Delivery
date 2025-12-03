# Database Schema

## Overview

The HomeRun backend manages a peer-to-peer delivery marketplace where:

- A **Purchaser** posts a delivery job
- A **Deliverer** accepts and completes the job
- A **Payment** is authorized at job acceptance and captured upon completion

Supports the core delivery lifecycle:

> Users → Post Jobs → Drivers Claim Jobs → Stripe Payment Finalized

Future expansions (Reviews, Vehicles, Reports) can be added without changing existing relationships.

## Entities

| Table      | Description                  |
| ---------- | ---------------------------- |
| Users      | Purchasers + Deliverers      |
| Deliveries | Jobs posted by purchasers    |
| Payments   | Stripe transactions for jobs |

---

---

## Models & Key Fields

### Users

- `user_id` (PK)
- `first_name`, `last_name`
- `email`, `phone`
- `role: 'purchaser' | 'deliverer'`
- `passwordHash`
- `isVerified`

### Deliveries

- `delivery_id` (PK)
- `pickup_address`, `dropoff_address`
- `item_description`, `proposed_payment`
- `status: 'open' | 'closed' | 'completed'`
- FK: `purchaser_id`
- FK: `deliverer_id`

### Payments

- `payment_id` (PK)
- `amount`
- `status` (Stripe enum)
- FK: `delivery_id`

```

```
