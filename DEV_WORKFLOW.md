# Development Workflow

## Quick Start

### Option 1: All-in-One (Turborepo orchestrates everything)
```bash
bun dev
```
This will start all services: PostgreSQL, Zero cache server, and Vite dev server.

### Option 2: Separate Terminals (For debugging individual services)

**Terminal 1 - Database:**
```bash
bun dev:db
```

**Terminal 2 - Zero Cache Server:**
```bash
bun dev:zero
```

**Terminal 3 - UI Dev Server:**
```bash
bun dev:ui
```

## Service Details

### PostgreSQL Database (`bun dev:db`)
- Runs in Docker container named `ztunes`
- Port: 5432
- Uses `DEV_PG_PASSWORD` from `.env`
- Data is ephemeral (removed on container stop)

### Zero Cache Server (`bun dev:zero`)
- Syncs database to Zero cache
- Requires PostgreSQL to be running
- Uses Zero's change data capture (CDC)
- Located in `packages/core`

### Vite Dev Server (`bun dev:ui`)
- React app with TanStack Router
- Port: 3000
- Located in `apps/web`
- Hot module replacement enabled

## Database Operations

```bash
# Push schema to database (no migration files)
bun db:push

# Generate migration files
bun db:generate

# Run migrations
bun db:migrate

# Seed database with sample data
bun db:seed
```

## Zero Schema

```bash
# Generate Zero schema from Drizzle schema
bun zero:generate

# Or run from core package
cd packages/core
bun run zero:generate
```

## Cleanup

```bash
# Stop and remove Docker containers, clean temp files
bun dev:clean
```

## Turborepo Task Dependencies

The `turbo.json` configuration defines these dependencies:

```
dev:db (no dependencies)
  ↓
dev:zero (depends on dev:db)
  ↓
dev (depends on dev:db, runs with dev:zero)
```

This ensures:
1. Database starts first
2. Zero waits for database
3. UI waits for database and runs alongside Zero

## Troubleshooting

### Database connection issues
```bash
# Clean up existing containers
bun dev:clean

# Start fresh
bun dev:db
```

### Zero schema out of sync
```bash
# Regenerate Zero schema
bun zero:generate
```

### Port conflicts
- PostgreSQL: 5432
- Vite dev server: 3000

Make sure these ports are available.
