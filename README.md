<div align="center">

<img src="public/logo.png" alt="Humanaira" width="88" />

# Humanaira

**A two-sided freelance services marketplace.**
Buyers commission work, sellers get paid, and the platform takes its cut — handled end to end with Stripe Connect.

[**Live site →**](https://humanaira.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%7C%20Auth%20%7C%20Realtime-3ECF8E?logo=supabase&logoColor=white)
![Stripe Connect](https://img.shields.io/badge/Stripe-Connect-635BFF?logo=stripe&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## What it does

Humanaira is a marketplace, not a storefront — which means money moves between three
parties instead of two, and most of the engineering lives in that difference.

| | |
|---|---|
| **Buyers** | Browse and search gigs, commission work, pay by card, track orders, message sellers, save listings |
| **Sellers** | Onboard to payments, publish and edit gigs, manage incoming orders, request payouts, run a dashboard |
| **Platform** | Takes a configurable commission on every transaction, automatically, at the moment of payment |

---

## The interesting part: marketplace payments

A normal checkout moves money from a customer to you. A marketplace has to split one
payment between the seller and the platform, and it has to do that without the platform
ever holding the seller's money — which is a regulated activity in most jurisdictions.

This is solved with **Stripe Connect Express accounts**, one per seller:

```
Buyer pays $100
      │
      ▼
Stripe Checkout Session
  payment_intent_data:
    application_fee_amount: 2000        ← platform commission, split at source
    transfer_data.destination: acct_…   ← the seller's own Connect account
      │
      ├──► $80 lands in the seller's Stripe account
      └──► $20 lands in the platform's
```

The split happens **inside Stripe**, at the moment of payment. The platform never
custodies the seller's funds, so there is no float to reconcile and no payout ledger
to get wrong.

**Details worth pointing at:**

- **Seller onboarding is idempotent.** `POST /api/stripe/connect/start` creates an Express
  account only if the profile has not got one, then returns a fresh onboarding link. Calling
  it twice does not create two accounts.
- **Live and test accounts are stored in separate columns** (`stripe_account_id_live`,
  `stripe_account_id_test`). A Connect account created in test mode is meaningless in live
  mode, so collapsing them into one column silently breaks the moment you flip environments.
- **The commission rate is configuration, not a constant** — `PLATFORM_FEE_PERCENT`, read at
  the point of charge, so changing it does not require a deploy of new pricing logic.
- **Fulfilment is driven by webhook, not by the browser.** An order is marked paid when
  Stripe sends `checkout.session.completed`, not when the buyer lands on the success page —
  because the buyer closing their laptop mid-redirect must not lose the order.

---

## Architecture

```
src/app/
├── (public)              browse · gigs/[slug] · about · help · legal
├── account/              profile, settings, saved gigs
├── seller/               dashboard · gigs CRUD · orders · payouts
├── orders/ · order/[id]  buyer-side order tracking
├── messages/             realtime conversations
└── api/
    ├── stripe/
    │   ├── connect/start     create or reuse a seller's Express account
    │   ├── create-session    checkout with application_fee + transfer_data
    │   └── webhook           signature-verified fulfilment
    ├── checkout/             order and add-on purchase flows
    ├── payouts/request       seller-initiated withdrawal
    ├── conversations/        thread creation, incl. straight from an order
    ├── gigs/ · reviews/      listing and rating
    └── profile/              init, me, payout settings
```

**Stack**

- **Next.js 15 (App Router)** — server components for data-heavy pages, route handlers for the API
- **TypeScript** throughout
- **Supabase** — Postgres, Auth, Row Level Security, and Realtime for message delivery
- **Stripe Connect** — Express accounts, split payments, webhooks
- **Tailwind CSS** for styling; **Framer Motion**, **Rive** and **react-three-fiber** for motion
- **Resend** for transactional email

---

## Security model

Worth stating plainly, because a marketplace gets this wrong more often than not:

- **The Supabase service role key bypasses every Row Level Security policy.** It is read only
  in server-side route handlers and is never prefixed `NEXT_PUBLIC_`, so it cannot reach the
  browser bundle.
- **Stripe webhooks are signature-verified** against `STRIPE_WEBHOOK_SECRET` before anything
  is written. An unverified webhook endpoint is an open door to marking any order paid.
- **Card details never touch this application.** Payment is handed to Stripe Checkout; the app
  sees a session id and a webhook, never a card number.
- **Every secret comes from the environment.** `.env.local` is gitignored, and `.env.example`
  documents the shape without the values.

---

## Running it locally

```bash
git clone https://github.com/judealsakarneh/humanaira
cd humanaira
npm install --legacy-peer-deps

cp .env.example .env.local     # then fill in your own keys
npm run dev                    # http://localhost:3000
```

You will need a Supabase project and a Stripe account in **test mode**. Use Stripe's
`4242 4242 4242 4242` test card; nothing in this repo should ever be pointed at live keys
during development.

To exercise webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

```bash
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint
```

---

## Project status

Built solo, and honest about where it stands:

- **Working** — auth, gig listing and search, checkout, Stripe Connect onboarding, split
  payments, webhook fulfilment, order tracking, realtime messaging, seller dashboard
- **In progress** — payout request flow, review moderation, test coverage
- **Known** — the `client/` directory is an earlier copy of the app kept during a
  restructure; the live build is the root `src/` tree

Further notes and working documents live in [`docs/`](docs/).

---

<div align="center">
<sub>Built by <a href="https://github.com/judealsakarneh">Jude Al Sakarneh</a></sub>
</div>
