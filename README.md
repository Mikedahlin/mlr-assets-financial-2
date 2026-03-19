# mlr-assets-financials

Revenue intelligence web app (KIRA) with AI chat + Stripe checkout.

## Theme
- black background (#050505 / #0F1318)
- emerald green (#1B5E3F)
- gold (#D4A574)
- chart and cards with dark variants

## Locally run

1. Copy environment example:
   ```bash
   cp .env.example .env
   ```
2. Install:
   ```bash
   pnpm install
   ```
3. Run typecheck and tests:
   ```bash
   pnpm run check
   pnpm vitest run
   ```
4. Run dev server:
   ```bash
   pnpm run dev
   ```
5. Open `http://localhost:3000` and `http://localhost:3000/kira`.

## Build for production

1. Build:
   ```bash
   pnpm run build
   ```
2. Start:
   ```bash
   pnpm run start
   ```
3. Confirm `dist` and interface load.

## Required environment variables

- `OAUTH_SERVER_URL`
- `JWT_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PRICE_ID`
- `BUILT_IN_FORGE_API_URL` (or `https://forge.manus.im` fallback)
- `BUILT_IN_FORGE_API_KEY`
- `CORS_ORIGINS` (e.g. `http://localhost:3000`)
- `VITE_ANALYTICS_ENDPOINT` (optional)
- `VITE_ANALYTICS_WEBSITE_ID` (optional)

## Deployment (Railway)

Railway deploy settings:
- Root dir: project root
- Install command: `pnpm install`
- Build command: `pnpm run build`
- Start command: `pnpm run start`

Railway env vars (set values in project settings):
- `NODE_ENV=production`
- `PORT=3000` (or default)
- all required env vars from above

## API endpoints

- `POST /api/stripe/create-checkout-session` (body: `{ priceId, quantity }`)
- `POST /api/trpc` (tRPC routes)
- `GET /api/oauth/callback` (OAuth callback, if configured)

## QA

- `http://localhost:3000/` should load (dark branded theme **black/green/gold**)
- `http://localhost:3000/kira` should load KIRA page with AI chat.
- Press `Checkout with Stripe` to verify redirect using configured Stripe keys.
- Chat with KIRA should call `trpc.ai.chat` via LLM backend.
# mlr-assets-financial-2
