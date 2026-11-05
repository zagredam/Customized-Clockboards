# ClockBoard

A full-screen clock app with five visual styles, multi-timer support, and 32 NFL team color themes, for the web and (in progress) iOS and Android.

## Features

- **5 clock modes** — Simple, Flipboard, Digital (seven-segment LED), Hourglass, Win95 retro
- **Timers & stopwatches** — create multiple at once with labels, presets (20s / 5m / 25m / 1h), and an audio completion alert
- **Theming** — 32 NFL team color palettes or fully custom colors, with a primary/secondary swap toggle
- **Display options** — toggle seconds, AM/PM, and date visibility
- **Fullscreen mode** — controls auto-hide after 2 seconds of inactivity
- **Gamepad support** — navigate and control with a game controller
- **Persistent state** — all settings and active timers survive page reloads via localStorage
- **Time sync** — optional drift correction via worldtimeapi.org

## Getting Started

**Requirements:** Node.js 20+

```bash
npm install       # once, at the repo root (npm workspaces)
npm run dev       # Web dev server → http://localhost:5173
npm run build     # Web production build → apps/web/dist/
npm run preview   # Preview web production build
npm run mobile    # Expo dev server for the mobile app
npm test          # Shared-logic unit tests
```

### Mobile

The mobile app (`apps/mobile`) uses [Expo](https://expo.dev). `npm run mobile` prints a QR code you can open in Expo Go on a phone. Once native features are added (lock-screen timers, widgets), use a development build (`npx expo run:ios` / `run:android`, or `npx eas-cli build --profile development`).

Currently ported: the simple clock, timers and stopwatches, and settings (theme and display toggles). The flipboard, digital, hourglass and Win95 screens are routed but show placeholders.

## Clock Modes

| Mode | Route | Description |
|---|---|---|
| Simple | `/` | Clean digital clock |
| Flipboard | `/flipboard` | Animated split-flap flip-board digits |
| Digital | `/digital` | Seven-segment LED display |
| Hourglass | `/hourglass` | Animated sand falling in real time |
| Win95 | `/win95` | Windows 95 retro desktop with draggable windows |

## Tech Stack

- [React 18](https://react.dev/) + [React Router 6](https://reactrouter.com/)
- [Vite 5](https://vitejs.dev/)
- React Context API + localStorage
- [Base UI](https://base-ui.com/) for accessible primitives
- Plain CSS with custom properties for theming

## Project Structure

```
apps/
  web/                # React + Vite web app
    src/              # components/, pages/, context/
    assets/           # Global CSS, fonts, timer sound
  mobile/             # Expo / React Native app (Expo Router, src/app/)
packages/
  shared/             # Platform-agnostic logic: themes, timers, date helpers, drift, API client
```

See [CLAUDE.md](CLAUDE.md) for development conventions and architecture notes.
