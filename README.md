# Green Trace — AI Forest Monitor (Frontend)

React + Vite + Tailwind frontend for the Green Trace forest monitoring dashboard, matching the provided screens: Overview, Sensor Map, Alerts, Forest Zones, Sensors, Reports, and Settings. The app runs entirely in the browser with local demo data from `src/data/mockData.js`.

## Run it in VS Code

1. Open this folder in VS Code.
2. Open a terminal (``Ctrl+` ``) and install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```
4. Open the URL it prints (usually `http://localhost:5173`) — it should open automatically.

## Project structure

```
src/
  components/     Sidebar, TopBar, StatCard, SatelliteMap (shared UI)
  pages/          One file per screen (Overview, SensorMap, Alerts, ForestZones, Sensors, Reports, Settings)
  data/           mockData.js — all placeholder data lives here
  App.jsx         Routes
  main.jsx        Entry point
```

## Build for production

```
npm run build
```

Output goes to `dist/`.
