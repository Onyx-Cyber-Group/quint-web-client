# quint-web-client

Minimal **Vite + vanilla JS** web client for the ONYX **Quint Splash API** and **Synapse** homeserver (`https://100.25.66.46`).

## Do developers need to be logged into AWS?

**No.** This app never calls the AWS API. It only speaks **HTTPS** to the Quint homeserver (`100.25.66.46`). That server already runs on EC2; it does not care whether anyone has the **AWS Console** or **AWS CLI** open. You only need **network reachability** to that host (and, for some networks, VPN or firewall rules your org allows). Operations still use AWS for **hosting** the box—that is separate from day-to-day frontend work.

## What credentials do you need?

| Credential | When you need it | How to get it |
|------------|------------------|---------------|
| **None** | Calling **public** API routes (health, some AI discovery endpoints) | Just run this app in dev mode. |
| **Matrix access token** | Almost all `/api/v1/...` routes that act as the logged-in user | Log in via Matrix **Client-Server API** (e.g. `POST /_matrix/client/v3/login` with user identifier + password), or receive a **short-lived test token** from Onyx. Send as `Authorization: Bearer <token>`. |
| **NOT for web clients** | Server operations only | `MATRIX_ADMIN_TOKEN`, AWS keys, SSH `.pem`, Jira API tokens — **never** embed these in a browser app. |

### Auth details (Quint API)

- Protected Flask routes validate the **Matrix access token** against Synapse (`/_matrix/client/r0/account/whoami` or v3 equivalent). See `quint-messaging-server/api/auth_middleware.py`.
- Header format: `Authorization: Bearer <matrix_access_token>`
- **CORS** is enabled on the API (`CORS(app)`), so browser calls are allowed once TLS trusts the server.

### TLS / self-signed certificate

The homeserver uses **HTTPS with a self-signed certificate**. Browsers will **block** `fetch('https://100.25.66.46/...')` from a random origin unless you add a trust exception (bad for production).

**This repo’s fix for local dev:** `npm run dev` runs Vite with a **proxy** (`vite.config.js`) for `/api` and `/_matrix` to `https://100.25.66.46` with `secure: false` (Node accepts the cert). Your front end calls **relative URLs** like `/api/v1/health` — no cert errors in the browser.

For **production**, put the built static files behind a **reverse proxy** with a **public CA** hostname, or terminate TLS correctly.

## Quick start

```bash
cd quint-web-client
npm install
npm run dev
```

Open **http://localhost:5173**. The UI includes:

1. **Overview** — quick `GET` checks for `/api/v1/health`, `/api/v1/ai/v181/status`, and Matrix `whoami` with a pasted access token.
2. **Swagger UI** — embedded **interactive OpenAPI** from the Quint server at `/api/docs/` (same as `https://100.25.66.46/api/docs/` when the server has `flask-swagger-ui` installed). Raw spec: `/api/openapi.json`.

If Swagger does not load in the iframe (e.g. `X-Frame-Options`), use **Open in new tab** on that screen.

## Getting a Matrix access token (password flow)

Example (run from your machine — **do not** commit passwords):

```bash
curl -s -X POST "https://100.25.66.46/_matrix/client/v3/login" \
  -H "Content-Type: application/json" \
  -d '{"type":"m.login.password","identifier":{"type":"m.id.user","user":"@YOURUSER:100.25.66.46"},"password":"YOURPASSWORD","initial_device_display_name":"quint-web-client"}' \
  -k
```

(`-k` skips TLS verify for **curl only**.) The JSON response includes `access_token`. Paste that into the page **only in local dev**.

Onyx can also issue **dedicated test accounts** — coordinate with the team instead of sharing production passwords.

## Build for production

```bash
npm run build
```

Output is in `dist/`. Configure your host so `/api` and `/_matrix` route to the Quint homeserver (or use env-specific `vite.config` / a small backend BFF).

## Related repos

- **API + Synapse deployment:** `quint-messaging-server` (Flask `quint_splash_service`, blueprints under `api/blueprints/`).
- **iOS client:** `QUINT001` (`APIConfiguration.swift` for base URLs).
- **OpenAPI:** when enabled on the server, `https://100.25.66.46/api/docs/` (see `api/app.py`).

## License

Internal ONYX / Onyx Cyber use unless otherwise agreed.
