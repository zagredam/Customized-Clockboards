# ClockBoard — Claude Code Guide

## Project Overview

ClockBoard displays a clock in multiple visual styles with integrated timer and stopwatch functionality. It is an npm-workspaces monorepo:

| Workspace | Path | What |
|---|---|---|
| `@clockboard/web` | `apps/web` | React + Vite web app (React Context + localStorage) |
| `@clockboard/mobile` | `apps/mobile` | Expo / React Native app for iOS + Android (Expo Router, AsyncStorage) |
| `@clockboard/shared` | `packages/shared` | Platform-agnostic JS shared by both apps: team themes, timer/stopwatch state logic, date helpers, clock-drift measurement, sync-API client |

`packages/shared` must stay free of React, DOM and React Native imports so either app can use it. Put new timer/business logic there first, then consume it from the apps.

## Dev Commands

Run from the repo root (`npm install` once at the root; never inside a workspace):

```bash
npm run dev       # Web dev server (Vite, typically http://localhost:5173)
npm run build     # Web production build to apps/web/dist/
npm run preview   # Preview web production build
npm run mobile    # Expo dev server for the mobile app
npm test          # Unit tests for packages/shared (node --test)
```

Add mobile dependencies with `npx expo install <pkg>` from `apps/mobile` so versions match the Expo SDK. See `apps/mobile/AGENTS.md` for Expo-specific guidance.

## Web Architecture (`apps/web`)

```
src/
  components/     # Reusable UI primitives (Clock, Nav, FlipDigit, Timer, Stopwatch, etc.)
  pages/          # Full-page clock views (ClockBoard, Flipboard, Digital, Hourglass, Win95)
  context/        # React Context providers (AppContext, SettingsContext, ServerContext)
  styles/         # Page-specific CSS files
  App.jsx         # Root component with React Router routes
  main.jsx        # Entry point
assets/
  styles/styles.css   # Global CSS + CSS variables for theming
  media/fonts/        # Custom fonts (Endzone Sans, Ubuntu Mono, Droid Sans Mono)
  media/timer.mp3     # Timer completion sound
```

### Routing (App.jsx)
Each clock mode is a route:
- `/` → `ClockBoard` (simple digital)
- `/flipboard` → flip-board animation
- `/digital` → seven-segment LED
- `/hourglass` → animated sand
- `/win95` → Windows 95 retro desktop

### State Management
- **AppContext** — timers, stopwatches, UI state (fullscreen, controls visibility)
- **SettingsContext** — theme, display options (seconds, AM/PM, date)
- **ServerContext** — optional backend sync URL and headers

All persisted keys in localStorage are prefixed with `cb_`.

### Theming
Themes are CSS variables set on `:root`. `packages/shared/src/teams.js` maps each NFL team to `primary` and `secondary` colors. Custom themes let users pick their own colors. The `altTheme` flag swaps primary/secondary.

## Mobile Architecture (`apps/mobile`)

```
src/
  app/            # Expo Router screens: index (mode picker), clock, flipboard, digital, hourglass, win95, timers, settings
  components/     # ModeScreen (shared shell per mode), SimpleClock, TimerList
  context/        # SettingsContext, TimersContext (AsyncStorage, same `cb_` keys as web)
  modes.js        # Clock-mode registry; `ported: false` modes show a placeholder
metro.config.js   # Pins `react` to the app's own copy (web uses React 18, mobile React 19)
```

Styles use `StyleSheet` (no CSS); theme colors come from `useSettings().themeValues`.

## Key Patterns

- Components receive no direct props for global state — they consume Context via `useContext`.
- `GamepadService.js` is a singleton that dispatches gamepad events into the app.
- `ServerContext` pings `worldtimeapi.org` to calculate clock drift and correct displayed time.
- The Win95 page manages draggable windows with a shared `zTop` counter for z-index layering.

## Conventions

- `.jsx` extension for all React components.
- Web CSS files are co-located in `apps/web/src/styles/` for pages and `apps/web/assets/styles/` for globals.
- No TypeScript — plain JavaScript throughout.
- Web: no CSS-in-JS — all styles in `.css` files with CSS custom properties for theming.
- Web icons via FontAwesome 5 (`@fortawesome/fontawesome-free`).
- Web accessible UI primitives via `@base-ui-components/react` (Dialog, Switch, RadioGroup, etc.).

## Adding a New Clock Mode

1. Web: create `apps/web/src/pages/NewMode.jsx` and optionally `apps/web/src/styles/newmode.css`.
2. Add a route in `apps/web/src/App.jsx`.
3. Add a nav entry in `apps/web/src/components/Nav.jsx`.
4. Mobile: add it to `apps/mobile/src/modes.js` and create `apps/mobile/src/app/<id>.jsx`.
5. Store the route key in the `cb_defaultRoute` localStorage value if it should be user-selectable as the default.
