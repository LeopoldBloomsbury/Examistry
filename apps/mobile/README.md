# CPA StudyPilot Mobile

First Expo implementation of the offline-first CPA StudyPilot study app.

## Architecture

- Expo React Native app for iOS and Android.
- `expo-sqlite` is the durable local store.
- Catalog content is versioned and copied into SQLite during bootstrap.
- Pack downloads are explicit. Downloaded packs, lessons, assets, progress, saves, and the mutation queue remain available offline.
- Progress and saved lesson writes are local-first and queued for server sync.

## Run

```bash
cd apps/mobile
npm install
npm run start
```

The current version ships with a local demo catalog. The server sync adapter is intentionally shaped around future `/api/mobile/bootstrap`, `/api/mobile/sync`, and `/api/mobile/download-manifest` endpoints.
