# Grocery App

A React Native / Expo grocery shopping app: browse products, manage a local cart, sign in, and check out with Stripe.

## Features

- Browse and search grocery listings
- Filter by category
- Add, update, and remove cart items (SQLite, scoped per user)
- Stripe Payment Sheet checkout
- Email/password auth with SecureStore
- Offline banner when the device has no network
- Cached listings so the catalog still appears if the API is unreachable

## Tech

- React Native, Expo
- React Navigation (native stack + bottom tabs)
- Formik + Yup
- Expo SQLite, Secure Store, NetInfo
- Stripe React Native SDK

The API (Node/Express) is a separate project. Point `api_url` at that server.

## Setup

1. Node.js 20 or 22
2. Xcode and/or Android Studio for simulators
3. Copy env vars:

```bash
cp .env.example .env
```

Then set:

- `api_url` — backend base URL (no trailing slash)
- `stripe_key` — Stripe **publishable** key (`pk_test_...`)

4. Install and run:

```bash
npm install
npx expo start
```

Native iOS / Android builds:

```bash
npm run ios
npm run android
```

## Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm start`       | Start Expo                 |
| `npm run ios`     | Run the iOS native app     |
| `npm run android` | Run the Android native app |
