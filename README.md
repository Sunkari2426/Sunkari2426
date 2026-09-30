# Scrap Mama

A monorepo for a customer Flutter application and an Express/MongoDB API for scheduling recyclable-scrap pickups.

## Layout

- `apps/customer_app/` — Flutter app (`scrap_mama`) arranged by core/config/models/services/repositories/providers/routes/widgets/features.
- `apps/api/` — Express API with controllers, routes, models, middleware, services, and configuration.

## Termux setup

Install prerequisites (the Flutter SDK is most practical through a Linux/proot environment; use an Android device/emulator or remote build host for running it):

```sh
pkg update && pkg upgrade
pkg install git nodejs-lts openjdk-17
```

Install Flutter following its Linux installation instructions, add its `bin` directory to `PATH`, then verify:

```sh
node --version
flutter doctor
```

### API

```sh
cd apps/api
cp .env.example .env
# Edit .env and provide MONGODB_URI and a long JWT_SECRET.
npm install
npm test
npm run dev
```

The API listens on `http://localhost:3000` by default. Use `npm start` for a non-reloading process.

### Flutter application

```sh
cd apps/customer_app
flutter pub get
flutter test
flutter run --dart-define=API_BASE_URL=https://your-api.example.com/api
```

For a local Android emulator API, use `http://10.0.2.2:3000/api`; a physical device needs a reachable LAN/tunnel URL.

## MongoDB and security

Use a remotely hosted MongoDB deployment such as MongoDB Atlas. Put its connection string only in `apps/api/.env` or your deployment secret store—never in Flutter source, build-time variables, or a committed file. `.env` files and private key material are excluded in `.gitignore`; `.env.example` documents the required non-secret variable names. Restrict the database network allowlist and create a least-privilege database user.

The mobile app talks only to the API. It receives a JWT after OTP verification and sends it as `Authorization: Bearer <token>`; it must never receive MongoDB credentials.

## API overview

All API endpoints are under `/api`. OTP endpoints are public: `POST /auth/request-otp`, `POST /auth/verify-otp`. Authenticated customer routes create/list addresses and create/list/read/cancel their pickups. Categories/rates are readable by authenticated users and managed by admins. Collectors can browse pending pickups, then accept pickups assigned to them and advance their own assigned pickups. Admins manage catalog/rates and explicitly assign collectors before acceptance.

Pickup lifecycle is strictly enforced:

`PENDING → ASSIGNED → ACCEPTED → EN_ROUTE → ARRIVED → WEIGHING → PAYMENT_PENDING → COMPLETED`

Cancellation is available only while a transition to `CANCELLED` is defined. At `PAYMENT_PENDING`, the service fetches the active database rate per category and calculates each line and the final total from actual measured weight; clients cannot submit a final amount.

## Tests

`apps/api` uses Node's built-in test runner for pricing and transition validation, so it needs no database or external service. Flutter includes a model mapping test.
