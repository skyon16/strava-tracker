# Strava Tracker

A continuation of a college project — connecting the Strava API to track and analyze fitness data alongside calendar events. Keeps workouts accountable whether you want to be or not.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS — hosted on GitHub Pages
- **Backend (BFF):** Express 5, TypeScript — hosted on Render
- **Auth:** Strava OAuth2 with session-based CSRF protection
- **Monorepo:** Turborepo with Yarn workspaces

## Demo

https://skyon16.github.io/strava-tracker/

## Getting Started

```bash
yarn install
```

###

Still in progress:
Webhooks
Calendar integration(need to setup a database and hook it up to the bff)

### Backend

```bash
cp apps/bff/.env.example apps/bff/.env
# Fill in Strava API credentials and session secret
cd apps/bff && yarn dev
```

### Frontend

```bash
cd apps/web && yarn dev
```

## Project Structure

```
apps/
  bff/       — Express API proxy (OAuth, session management, Strava API)
  web/       — React frontend
packages/
  ui/        — Shared component library
  eslint-config/
  typescript-config/
  tailwind-config/
```
