# quint-web-client

Minimal **Vite + vanilla JS** web client for the ONYX **Quint Splash API** and **Synapse** homeserver.

**Onboarding (Matrix token, registration vs admin, env):** see [docs/DEVELOPER_ONBOARDING.md](docs/DEVELOPER_ONBOARDING.md).

## Do developers need to be logged into AWS?

**No.** This app never calls the AWS API. It speaks **HTTPS** to the Quint homeserver. That server runs on EC2, but your local development does not require AWS credentials — only **network reachability** to the host (and, for some networks, VPN or firewall rules your org allows). Operations use AWS for hosting; that is separate from day-to-day frontend work.

## What credentials do you need?

| Credential | When you need it | How to get it |
|------------|------------------|---------------|
| **None** | Calling **public** API routes (health, some AI discovery endpoints) | Just run this app in dev mode. |
| **Matrix access token** | Almost all `/api/v1/...` routes that act as the logged-in user | Log in via Matrix **Client-Server API** (e.g. `POST /_matrix/client/v3/login` with user identifier + password), or receive a **short-lived test token** from Onyx. Send as `Authorization: Bearer <token>`. |
| **NOT for web clients** | Server operations only | `MATRIX_ADMIN_TOKEN`, AWS keys, SSH `.pem`, Jira API tokens — **never** embed these in a browser app. |

### Auth details (Quint API)

- Protected Flask routes validate the **Matrix access token** against Synapse (`/_matrix/client/r0/account/whoami` or v3 equivalent).
- Header format: `Authorization: Bearer <matrix_access_token>`
- **CORS** is enabled on the API (`CORS(app)`), so browser calls are allowed once TLS trusts the server.

### TLS / self-signed certificate

The homeserver uses **HTTPS with a self-signed certificate**. Browsers will block direct `fetch()` calls unless you add a trust exception (not recommended for production).

**This repo's fix for local dev:** `npm run dev` runs Vite with a **proxy** (`vite.config.js`) that forwards `/api` and `/_matrix` to the host defined in your `.env` file (`VITE_API_HOST`) with `secure: false` (Node accepts the cert). Your front end calls **relative URLs** like `/api/v1/health` — no cert errors in the browser.

For **production**, put the built static files behind a **reverse proxy** with a **public CA** hostname, or terminate TLS correctly.

## Quick start

```bash
cp .env.example .env
# Edit .env — set VITE_API_HOST to the server URL from your team

npm install
npm run dev
```

Open **http://localhost:5173**. The UI includes:

1. **Overview** — quick `GET` checks for `/api/v1/health`, `/api/v1/ai/v181/status`, and Matrix `whoami` with a pasted access token.
2. **Swagger UI** — embedded **interactive OpenAPI** from the Quint server at `/api/docs/`. Raw spec: `/api/openapi.json`.

If Swagger does not load in the iframe (e.g. `X-Frame-Options`), use **Open in new tab** on that screen.

## Getting a Matrix access token (password flow)

Example (run from your machine — **do not** commit passwords):

```bash
curl -s -X POST "$VITE_API_HOST/_matrix/client/v3/login" \
  -H "Content-Type: application/json" \
  -d '{"type":"m.login.password","identifier":{"type":"m.id.user","user":"@YOURUSER:yourdomain"},"password":"YOURPASSWORD","initial_device_display_name":"quint-web-client"}' \
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

- **API reference (sanitized):** `quint-api` — code-only snapshot of the Flask REST layer.
- **OpenAPI / Swagger:** available at `/api/docs/` on the running server (ask for the staging URL).

## Team

- **Web / front-end:** [@rcondron](https://github.com/rcondron) — primary contact for this client.

## License

Internal ONYX / Onyx Cyber use unless otherwise agreed.
