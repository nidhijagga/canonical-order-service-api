# Canonical Order Service API

A lightweight Node.js service that ingests e-commerce webhooks, normalizes them into a canonical order representation, ensures idempotent persistence, and exposes stored orders.

## Features

-   Authenticated `POST /webhooks/order` endpoint secured with a shared secret header.
-   Canonical DTO transformation including ship-to hashing and line normalization.
-   Idempotent MongoDB persistence using `event_id` as the unique key.
-   `GET /orders` endpoint to list stored canonical orders.
-   Health probe at `GET /api/health` for monitoring.

## Getting Started

### Prerequisites

-   Node.js 18+
-   MongoDB instance (hosted)

### Environment

Create a `.env` file like:

```
PORT=8000
DATABASE_PATH=mongodb://localhost:27017/canonical-orders
WEBHOOK_SECRET=supersecretsharedkey123
```

### Install & Run

```sh
npm install
npm run dev
```

The API listens on `http://localhost:8000` by default.

## API Reference

### Health

```
GET /api/health
```

Response: `{ "status": "ok" }`

### Receive Webhook

```
POST /webhooks/order
Headers:
  x-webhook-secret: <WEBHOOK_SECRET>
Body: Shopify-like payload (see example below)
```

Responses:

-   `201` stored new canonical order
-   `200` duplicate `event_id`
-   `400` invalid payload
-   `401` missing/invalid secret

### List Orders

```
GET /orders
```

Returns an array of canonical orders in descending `created_at` order.

## Canonical Order DTO

```
{
  "event_id": "string",
  "external_platform": "shopify",
  "external_order_id": "string",
  "order_name": "#1234",
  "customer_email": "string",
  "ship_to_hash": "sha256 hash",
  "lines": [ { "sku": "string", "qty": 1 } ],
  "total": 123.45,
  "status": "RECEIVED",
  "created_at": "ISO-8601 timestamp"
}
```

## Sample Webhook Payload

```
{
  "event_id": "evt_1001",
  "platform": "shopify",
  "order": {
    "id": "987654",
    "name": "#1001",
    "email": "john.doe@example.com",
    "shipping_address": {
      "name": "John Doe",
      "address1": "123 Market Street",
      "city": "San Francisco",
      "zip": "94105",
      "country": "US"
    },
    "line_items": [
      { "sku": "SKU-RED-001", "quantity": 2, "price": 50 }
    ],
    "total_price": 100
  }
}
```

## Testing with curl

### POST /webhooks/order

```sh
curl -X POST http://localhost:8000/webhooks/order \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: supersecretsharedkey123" \
  -d '{
    "event_id": "evt_1001",
    "platform": "shopify",
    "order": {
      "id": "987654",
      "name": "#1001",
      "email": "john.doe@example.com",
      "shipping_address": {
        "name": "John Doe",
        "address1": "123 Market Street",
        "city": "San Francisco",
        "zip": "94105",
        "country": "US"
      },
      "line_items": [
        { "sku": "SKU-RED-001", "quantity": 2, "price": 50 }
      ],
      "total_price": 100
    }
  }'
```

### GET /orders

```sh
curl http://localhost:8000/orders
```

## Logs & Monitoring

-   Application logs: standard output (use a process manager or container logs in production).
-   MongoDB connection errors prevent startup to avoid running without persistence.

## Future Enhancements

1. Add schema validation for payloads (e.g., Joi/Zod).
2. Plug in structured logging and tracing.
3. Introduce pagination for `GET /orders`.
