# Fastify Example

A multi-tenant API starter for WhatsApp messaging, built with Fastify. Each organization connects its own WhatsApp instances and integrates through API keys and webhooks. It started as the early base of Linkify and was kept as a template after the product evolved. It pairs with the [vite-template](https://github.com/MatheusDomingues/vite-template) front end.

## What's inside

- **Multi-tenant model:** organizations, users and invites
- **WhatsApp instances** powered by Baileys, with QR code pairing and session management
- **Event processing** with BullMQ workers for connection updates, incoming messages and calls
- **Webhooks** per instance to forward events to client systems
- **API keys** for server-to-server integrations, plus JWT auth for the dashboard
- **Transactional email** with Resend
- **Typed routes** with Zod and Swagger UI at `/docs`
- **Docker** image and Docker Compose setup

## Stack

TypeScript · Node.js · Fastify · Prisma · PostgreSQL · Redis · BullMQ · Baileys · Zod · Docker

## Getting started

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```

The API runs on `http://localhost:5000` by default.
