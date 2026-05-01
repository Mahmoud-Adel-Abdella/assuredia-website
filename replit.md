# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains Assuredia — a B2B Continuous QA Monitoring SaaS platform.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod, `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Recharts

## Artifacts

- **assuredia** (`/`) — Main frontend React app (landing, dashboard, clients, reports, settings)
- **api-server** (`/api`) — Express backend with all routes

## Application

Assuredia is a B2B Continuous QA Monitoring platform. Tagline: "Detect. Inform. Action."

### Pages
- `/` — Landing page
- `/dashboard` — Monitoring hub with charts, metrics, alerts
- `/clients` — Client management (add, trigger test runs)
- `/reports` — Historical test execution data
- `/settings` — Client configuration and notification preferences

### API Routes
- `GET/POST /api/clients` — Client management
- `GET/PUT/DELETE /api/clients/:id` — Individual client operations
- `GET/POST /api/test-runs` — Test run management
- `GET /api/test-runs/:id` — Individual test run
- `GET/POST /api/alerts` — Alert management
- `PUT /api/alerts/:id/resolve` — Resolve an alert
- `GET /api/dashboard/summary` — Aggregate metrics
- `GET /api/dashboard/trend` — Execution trend over time
- `GET /api/dashboard/failed-by-module` — Failures by module
- `GET /api/reports` — Historical reports

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Database Schema

- `clients` — Monitored clients with status and success rate
- `test_runs` — Individual test run records per client
- `alerts` — Alerts/issues detected during test runs

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
