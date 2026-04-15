# Developer onboarding — Quint web client

This repo is a **minimal Vite** front end for talking to the **Quint REST API** and **Matrix (Synapse)**. Pair it with the sanitized **`quint-api`** backend repo for server-side code.

## What to get from the team (Gary / server lead)

All values should be for **staging** or **local** — not production:

| Item | Purpose |
|------|---------|
| **Vite env vars** | Usually `VITE_*` prefixes in `.env` / `.env.local` (exact names are in `README` or `src` — ask if unsure). |
| **Quint API base URL** | Where REST calls go (staging gateway or `http://localhost:8080`). |
| **Matrix homeserver URL** | Where the Matrix Client-Server API lives (staging Synapse or local `:8008`). |
| **Test Matrix user + `access_token`** | For any flow that calls authenticated REST routes. Same rules as the API repo: **normal user**, not admin. |

## Ryan’s question — Matrix account vs registration “key”

- **Matrix account:** You need a **regular** test user on the **dev/staging** homeserver and a valid **`access_token`** for `Authorization: Bearer …` when the API requires it.

- **“Key” to register users:** Registration is **not** a single shared secret. It goes through **phone verification sessions** then `POST /_matrix/client/v3/register` with `auth.type` = `m.login.registration_token` and the **verified session id**. Ops can give you **staging** OTP behavior (Twilio test, fixed numbers, etc.).

- **Do not ask for** Synapse **`MATRIX_ADMIN_TOKEN`** for routine web work.

## OpenAPI / Swagger (full server)

When hitting the **deployed** Quint API (from `quint-messaging-server`, not necessarily this trimmed tree), ask the team for staging links:

- **UI:** `/api/docs/`
- **Spec:** `/api/openapi.json`

## Security

- Never commit `.env` or real tokens.
- If a token is exposed, ask for a **rotate** on staging.
