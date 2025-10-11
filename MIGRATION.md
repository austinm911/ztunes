# Turborepo Monorepo Migration

## Overview

This project has been migrated to a Turborepo monorepo structure for better code organization and dependency management.

## New Structure

```
ztunes/
├── apps/
│   └── web/                    # Frontend application
│       ├── src/
│       │   ├── components/
│       │   ├── routes/
│       │   └── router.tsx
│       ├── scripts/
│       ├── public/
│       └── package.json
├── packages/
│   ├── core/                   # Backend core (Zero, DB, Auth)
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── db/
│   │   │   ├── shared/
│   │   │   └── zero/
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   ├── env/                    # Environment configuration
│   │   ├── src/index.ts
│   │   └── package.json
│   └── tsconfig/               # Shared TypeScript configs
│       ├── base.json
│       └── package.json
├── package.json                # Root package.json with workspaces
└── turbo.json                  # Turborepo configuration
```

## Package Structure

### Root Package (`ztunes`)
- Manages workspaces for `apps/*` and `packages/*`
- Uses catalog and catalogs for shared dependencies
- Turborepo for task orchestration

### `@ztunes/web` (apps/web)
- Frontend React application
- Uses TanStack Router and React Start
- Depends on `@ztunes/core` and `@ztunes/env`

### `@ztunes/core` (packages/core)
- Backend core functionality
- Contains Zero schema, mutators, and queries
- Database models and migrations (Drizzle)
- Authentication (Better Auth)
- Exports:
  - `@ztunes/core/auth` - Auth functionality
  - `@ztunes/core/db` - Database connection
  - `@ztunes/core/zero` - Zero schema and mutators
  - `@ztunes/core/shared/*` - Shared utilities

### `@ztunes/env` (packages/env)
- Environment variable configuration
- Loads and expands .env files using dotenv

### `@ztunes/tsconfig` (packages/tsconfig)
- Shared TypeScript configuration
- Used by all packages for consistent TypeScript settings

## Key Commands

### Development (Run in Separate Terminals)

**Option 1: Run all services with Turborepo (Recommended)**
```bash
# Terminal 1: Start all services (UI + DB + Zero)
bun dev
```

**Option 2: Run services separately for debugging**
```bash
# Terminal 1: Start database
bun dev:db

# Terminal 2: Start Zero cache server (waits for DB)
bun dev:zero

# Terminal 3: Start UI dev server
bun dev:ui
```

### Individual Service Commands

From the root directory:
- `bun dev:ui` - Run Vite dev server (port 3000)
- `bun dev:db` - Start PostgreSQL in Docker (port 5432)
- `bun dev:zero` - Run Zero cache server (requires DB)
- `bun dev:clean` - Clean up Docker containers and temp files

### How Turborepo Orchestrates Services

When you run `bun dev`, Turborepo will:
1. **Start `dev:db` first** - PostgreSQL container
2. **Start `dev:zero` in parallel** (waits for DB dependency)
3. **Start `dev` (UI)** in parallel (waits for DB dependency)

This uses Turborepo's `dependsOn` and `with` features to properly sequence startup.

### Database
```bash
# Generate migrations
bun db:generate

# Push schema to database
bun db:push

# Run migrations
bun db:migrate

# Seed database
bun db:seed
```

### Zero
```bash
# Generate Zero schema
bun zero:generate

# Run Zero cache server
bun zero:cache
```

### Build & Type Checking
```bash
# Build all packages
bun build

# Type check all packages
bun typecheck

# Clean everything
bun clean
```

## Migration Changes

### Import Path Changes
All imports have been updated to use workspace aliases:

**Before:**
```typescript
import { db } from 'db';
import { must } from 'shared/must';
import { schema } from 'zero/schema';
import { authClient } from 'auth/client';
```

**After:**
```typescript
import { db } from '@ztunes/core/db';
import { must } from '@ztunes/core/shared/must';
import { schema } from '@ztunes/core/zero/schema';
import { authClient } from '@ztunes/core/auth/client';
```

### Configuration Updates

1. **Vite Config** - Updated `srcDirectory` from `"app"` to `"src"`
2. **Drizzle Config** - Moved to `packages/core/drizzle.config.ts`
3. **Scripts** - Updated paths to reference monorepo structure
4. **TSConfig** - Now extends `@ztunes/tsconfig/base.json`

### Old Directories (Can be removed)
The following root-level directories are now deprecated:
- `/app` (moved to `/apps/web/src`)
- `/auth` (moved to `/packages/core/src/auth`)
- `/db` (moved to `/packages/core/src/db`)
- `/shared` (moved to `/packages/core/src/shared`)
- `/zero` (moved to `/packages/core/src/zero`)
- `/scripts` (moved to `/apps/web/scripts`)

These are already added to `.gitignore` and can be safely deleted.

## Catalog System

The project uses Bun's catalog feature for dependency management:

### Main Catalog
Shared across all packages:
- `@rocicorp/zero`
- `drizzle-orm`
- `better-auth`
- `typescript`
- `zod`, etc.

### Frontend Catalog
Frontend-specific dependencies:
- `vite`
- `@tanstack/react-router`
- `react`
- `react-dom`, etc.

### Backend Catalog
Backend-specific dependencies:
- `drizzle-orm`
- `drizzle-kit`
- `pg`, etc.

### Types Catalog
Type definitions:
- `@types/react`
- `@types/node`
- `@types/pg`, etc.

### Utilities Catalog
Development utilities:
- `dotenv`
- `tsx`
- `concurrently`, etc.

## Next Steps

1. Test the dev environment:
   ```bash
   bun dev
   ```

2. Verify database operations work:
   ```bash
   bun db:push
   bun db:seed
   ```

3. Clean up old directories:
   ```bash
   rm -rf app auth db shared zero scripts
   ```

4. Commit the changes:
   ```bash
   git add .
   git commit -m "Migrate to Turborepo monorepo structure"
   ```
