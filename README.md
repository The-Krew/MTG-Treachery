# MTG-Treachery

Treachery is a multiplayer party game built with React Native + Expo. Players create or join lobbies, receive secret role cards, and play together using a WebSocket backend.

This repository contains the client app (mobile-first) implemented using Expo, NativeWind (Tailwind) and React Native Reanimated.

- Live WebSocket backend: `wss://treachery.thekrew.app:3000/` (used by the client)

## Quickstart

Prerequisites
- Node.js (16+ recommended)
- Expo CLI (`npm install -g expo-cli`) or use `npx expo`
- Android Studio / Xcode simulator or a physical device with Expo Go or a development build

Install

```bash
npm install
# or use bun if you prefer
# bun install
```

Run (development)

```bash
npm start
# then open on a simulator or device from the Expo UI
```

Build (EAS)

```bash
npm run build:eas
# or
npm run build:local
```

## Project structure (high-level)

- `app/` — Expo entry & router
  - `_layout.tsx` — root providers and app layout
  - `index.tsx` — `WebSocketWrapper` (connection & reconnection handling)
  - `router.tsx` — routes messages between Lobby and Game screens
- `components/` — UI and feature components
  - `lobby*` — lobby UI: create/join/share players
  - `game*` — game UI: card flip, role header, controls
  - `interface/*` — modal contexts (confirm, info, rarity)
  - `ui/*` — small UI primitives (Button, Header, Container)
  - `playerContext.tsx` — React Context for player state
  - `serverConnect.tsx` — shown while connecting to server
- `internal/types.ts` — Request/Response protocol types and `Card`/`Player` definitions
- `assets/`, `images/`, config files (Tailwind, babel, metro, etc.)

## How it works (runtime)

- On startup, `app/_layout.tsx` sets up contexts and renders `WebSocketWrapper`.
- `WebSocketWrapper` opens a WebSocket (using a stable `idRef`) and requests the current state (`info/state`). It also sends periodic heartbeats.
- `app/router.tsx` listens to server messages and dispatches them to update context state or show modals.
- Lobby flow: create -> share/copy code -> others join -> owner starts game (select rarity) -> server assigns cards/roles.
- Game flow: players can `peek` (temporary reveal) or `unveil` (permanent reveal). Actions are sent as `Request` messages over the socket.

## WebSocket protocol (client-side shapes)

See `internal/types.ts` for full TypeScript definitions. Key points:
- `Request` has `type` ("lobby" | "info" | "game" | "ping"), `method` and `body`.
- `Response` from server uses `type` ("lobby" | "info" | "game" | "pong") and `body` variants like `StartGameBody` and `UnveilBody`.

Common client requests
- Create lobby: `{ type: 'lobby', method: 'create', body: { code } }`
- Join lobby: `{ type: 'lobby', method: 'join', body: { code } }`
- Start game: `{ type: 'game', method: 'start', body: { code, rarity } }`
- Unveil: `{ type: 'game', method: 'unveil', body: { code } }`
- Heartbeat: `{ type: 'ping', method: 'heartbeat', body: { code: '' } }`


## Contributing
- Open an issue to discuss major changes.
- For small fixes (typos, docs), submit a PR with a short description.
- If you want me to implement common fixes (e.g. increase lobby code length or extract WebSocket URL), tell me and I can make the change.

## License
This project includes a `LICENSE` file in the repository.

