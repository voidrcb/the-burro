# Big Bend Burro - Deployment Checklist

**Created:** 2026-03-21
**Updated:** 2026-03-28
**Status:** Deployment Pending
**Application Build:** PASS (83 pages)
**Post-Mortem:** COMPLETE

---

## Current Verified State

- `pnpm lint`: PASS with non-blocking image warnings only
- `pnpm typecheck`: PASS
- `pnpm build`: PASS
- Auth routes verified locally
- Shop order API verified locally
- Public shop/stay sprint-copy cleanup complete
- Deployment still requires production environment variables and HTTPS

---

## Pre-Deployment Requirements

Before public launch, set these environment variables for the frontend:

```powershell
OPERATOR_SESSION_SECRET=<strong-random-secret>
OPERATOR_USERNAME=operator   # optional, defaults to operator
OPERATOR_PASSWORD=<secure-password>
CHUCK_PASSWORD=<secure-password>
SUSAN_PASSWORD=<secure-password>
NEXT_PUBLIC_BASE_URL=https://bigbendburro.vcetexas.com
```

Do not deploy without `OPERATOR_SESSION_SECRET` and the operator passwords configured.

---

## Deployment Steps

### Step 1: Build Verification

From `C:\handmaidens\The Burro\website\frontend`:

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

Expected result: build completes with 83 pages generated.

### Step 2: Start the Frontend

**Local production test**

```powershell
cd "C:\handmaidens\The Burro\website\frontend"
pnpm start -- --port 3000
```

**Container or service deployment**

Use the project deployment method already configured for this host. Confirm the frontend is serving the built app before routing traffic.

### Step 3: Verify Reverse Proxy and Tunnel

If using the Windows + WSL + cloudflared path, verify:

1. `bigbendburro.vcetexas.com` is present in `C:\ProgramData\cloudflared\config.yml`
2. The current WSL IP is reflected in the tunnel config when that architecture is in use
3. Caddy or the active reverse proxy is routing traffic to the frontend service
4. HTTPS is active end to end

Helpful commands:

```powershell
wsl -d Ubuntu -- hostname -I
wsl -d Ubuntu -- docker ps
curl https://bigbendburro.vcetexas.com
```

### Step 4: Auth Validation

Verify these flows against the deployed site:

- `GET /login` returns 200
- `GET /assistant` redirects to `/login` when unauthenticated
- Valid login returns 200
- Invalid login returns 401
- Session cookie is `Secure` and `HttpOnly`
- Authenticated `/assistant` access succeeds
- Logout clears the session

### Step 5: Commerce Validation

Verify these API checks against the deployed site:

- `POST /api/shop/orders` valid payload returns 200
- `POST /api/shop/orders` invalid payload returns 400
- Checkout copy matches the manual-payment workflow

---

## Troubleshooting

### Login Works Locally But Not In Browser
- Confirm `NEXT_PUBLIC_BASE_URL` matches the deployed HTTPS origin
- Confirm the site is served over HTTPS so the secure auth cookie can be replayed
- Confirm production passwords are actually set in the runtime environment

### 502 / Bad Gateway
- Reverse proxy cannot reach the frontend
- Check the frontend process/container first
- Then verify Caddy or the active reverse proxy target
- Then verify cloudflared or DNS routing

### 404 / Tunnel Mismatch
- Check the hostname entry in `C:\ProgramData\cloudflared\config.yml`
- Restart the `cloudflared` service after config changes

### Build Fails

```powershell
Remove-Item -Recurse -Force "C:\handmaidens\The Burro\website\frontend\.next"
cd "C:\handmaidens\The Burro\website\frontend"
pnpm build
```

---

## Key Paths

| File | Path |
|------|------|
| Frontend app | `C:\handmaidens\The Burro\website\frontend\` |
| Build cache | `C:\handmaidens\The Burro\website\frontend\.next\` |
| Handoff state | `C:\handmaidens\The Burro\Sprints\.sprint_handoff.json` |
| Current state | `C:\handmaidens\The Burro\memory\current_state.md` |
| Post-mortem review | `C:\handmaidens\The Burro\Sprints\Reviews\POSTMORTEM_REVIEW.md` |

---

## Final Go/No-Go

Go live only if all are true:

- Build passes
- Production auth env vars are set
- HTTPS is working
- `/assistant` redirect/login/logout flow is verified
- Shop order API returns 200/400 for valid/invalid payloads

---

*Last Updated: 2026-03-28*
*Status: Ready for deployment execution*
