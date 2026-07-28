# Examistry TODO

## Mobile App

- [ ] Install and lock mobile dependencies in `apps/mobile`. Blocked locally: package resolution hangs under restricted network access.
- [ ] Run `npm --prefix apps/mobile run typecheck` after install. Blocked until mobile dependencies are installed.
- [ ] Run Expo locally on iOS and Android simulators and fix native/runtime issues. Blocked until dependencies and simulator runtime are available.
- [x] Add mobile API endpoints:
  - [x] `GET /api/mobile/bootstrap`
  - [x] `POST /api/mobile/sync`
  - [x] `GET /api/mobile/download-manifest`
- [x] Replace mobile demo catalog with server-provided catalog bundles, with bundled demo fallback when the server is not configured.
- [x] Add auth/session handling for mobile Supabase users via bearer-token server routes and local mobile session storage.
- [x] Add entitlement refresh and offline revalidation metadata to mobile bootstrap.
- [ ] Store downloaded guide/asset files on-device instead of only marking metadata offline. Requires native file-system dependency after mobile install.
- [x] Add conflict handling for queued progress and saved lesson mutations by accepting/rejecting individual sync mutations.

## CPA Launch

- [x] Decide the first paid CPA offer to emphasize: AUD Quickstart.
- [x] Tighten CPA landing-page copy around one buyer pain: first-time CPA candidates who need AUD sequence before volume.
- [x] Expand the free CPA guide into a stronger lead magnet with a concrete before/after promise.
- [x] Add checkout test coverage for unauthenticated email-first purchase in runtime smoke.
- [ ] Add signed-in checkout coverage. Requires a Supabase-authenticated test harness or route-level dependency injection.
- [ ] Run a full Stripe webhook test with pending entitlement, active entitlement, and checkout expiration. Requires Stripe webhook secrets and test events.

## Later

- [ ] Add analytics/events for guide capture, checkout start, purchase complete, pack opened, lesson completed, and mobile sync.
- [ ] Build admin import/export for lessons and assets before content volume grows.
