# Post-Mortem Review - Big Bend Burro

**Date:** 2026-03-28
**Reviewer:** Codex (The Burro)
**Status:** COMPLETE

---

## Executive Summary

The post-mortem found two material gaps in the prior "production ready" claim:

1. Public shop and stay flows still exposed sprint/scaffold implementation language.
2. Authentication still relied on repo-baked fallback passwords and a fallback session secret.

Both issues were fixed in this session. The project now builds cleanly, the key auth and order flows were smoke-tested against a live local server, and deployment readiness depends on setting the required auth environment variables in production.

---

## Findings

### 1. Public Content Cleanup Was Incomplete

**Affected files:**
- `website/frontend/components/shop/ShopCheckoutForm.tsx`
- `website/frontend/components/shop/ProductPurchasePanel.tsx`
- `website/frontend/components/stay/BookingFlowForm.tsx`

**Problem:** Public UI still referenced `Sprint 1.4`, `Sprint 1.2`, and `scaffold-mode`, contradicting the claim that public-facing scaffold language had been fully removed.

**Resolution:** Rewrote public copy to describe the real guest experience:
- manual payment follow-up for shop orders
- Lodgify handoff for booking completion
- single shipping profile rule without sprint jargon

### 2. Authentication Was Not Production-Safe

**Affected files:**
- `website/frontend/app/api/auth/login/route.ts`
- `website/frontend/middleware.ts`
- `website/frontend/app/api/auth/logout/route.ts`
- `website/frontend/lib/auth/operator-auth.ts` (new)

**Problem:**
- hardcoded fallback passwords remained in the login route
- a fallback session secret remained in code
- token generation used a reversible base64 pattern instead of a signed token
- prior docs still advertised default credentials

**Resolution:**
- removed repo-baked fallback passwords/secrets
- introduced shared auth configuration helper
- require environment-backed passwords and session secret
- switched session token generation to HMAC signing
- verified the login cookie is `Secure` and `HttpOnly`

### 3. Documentation Drift Existed

**Problem:** Multiple documents still reflected the optimistic previous handoff, including default credentials and older stack wording.

**Resolution:** Updated current state, handoff notes, session log, decision log, and added this post-mortem review.

---

## Verification

### Claimed Completion Checks

- `ImageWithFallback` exists and is used in public catalog components: PASS
- `SiteFooter` exists and is mounted in `SiteShell`: PASS
- Shop link exists in `PrimaryNav`: PASS
- `rounded-[22px]` standard is present across public cards/forms: PASS
- Public shop/stay sprint/scaffold copy removed: PASS after fix
- Activation guide exists at `Sprints/Reviews/ENH-002_PAYMENT_ACTIVATION.md`: PASS

### Quality Gates

- `pnpm lint`: PASS with existing non-blocking raw `<img>` warnings in livestream/rental flows
- `pnpm typecheck`: PASS
- `pnpm build`: PASS (83 pages)
- `pnpm test`: NOT AVAILABLE (`package.json` has no test script)

### Security Checks

- No hardcoded fallback auth credentials remain in code: PASS
- Auth cookie is `HttpOnly`: PASS
- Protected routes redirect when unauthenticated: PASS
- `POST /api/shop/orders` rejects invalid payloads with `400`: PASS
- Order API accepts valid payloads with `200`: PASS

### Live Smoke Tests

Server run used explicit local env vars and the built app on port `3001`.

- `GET /login` → `200`
- `GET /assistant` unauthenticated → `307`
- `POST /api/auth/login` valid credentials → `200`
- `POST /api/auth/login` invalid credentials → `401`
- `GET /assistant` with issued session cookie → `200`
- `POST /api/shop/orders` valid payload → `200`
- `POST /api/shop/orders` invalid payload → `400`
- `POST /api/auth/logout` → `200`

Note: because the cookie is correctly marked `Secure`, a plain HTTP local smoke session will not automatically replay it. Middleware acceptance was verified by manually replaying the issued cookie value.

---

## Residual Risks

- Production deployment must set `OPERATOR_SESSION_SECRET`, `OPERATOR_PASSWORD`, `CHUCK_PASSWORD`, and `SUSAN_PASSWORD` before public launch.
- Lint still reports raw `<img>` usage in `components/livestream/StreamPlayer.tsx` and `components/rental/MobileInspectionWorkflow.tsx`.
- `package.json` still has no automated test script.
- Some project instructions/document headers still describe the stack as Next.js 15 even though the repo is on Next.js 14.2.33.

---

## Final Status

**Deployment Ready**

The codebase is ready to deploy once production auth environment variables are configured. Manual payment handoff remains the intentional operational model until Stripe activation is completed.

## Addendum: Live Deployment Incident (2026-03-28 Evening)

After the post-mortem closeout, live deployment validation exposed a separate edge-delivery problem:

- Burro origin and JavaScript assets were healthy.
- The exact public hashed CSS path being served by the homepage returned `502`, producing an unstyled flat page.
- The failure was isolated as a path-specific public CSS issue rather than a broken build, because cache-busted CSS requests and all main JS chunks returned `200`.
- A duplicate VM-side `burro-app` container publishing port `3000` was also removed to simplify origin routing.
- A stylesheet fingerprint rotation was forced by updating `website/frontend/app/globals.css`, rebuilding, and restarting the live Windows `next start` process.
- Public homepage HTML captured after the restart references the new stylesheet path `/_next/static/css/c9ecc3f2dccd5a82.css`, and that new public CSS URL returned `200`.

This means the original flat-page failure mode was materially addressed. If operators still see `502` or flat rendering, the next session should inspect the protected Windows `cloudflared` service state or stale client/browser cache, not the Burro origin build.
