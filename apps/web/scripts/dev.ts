import {concurrently} from 'concurrently';
import {must} from '@ztunes/core/shared/must';
import '@ztunes/env';
import {execSync} from 'child_process';

// Check env sync before starting dev servers
try {
  execSync('tsx scripts/check-env.ts', {stdio: 'inherit'});
} catch (error) {
  process.exit(1);
}

const devPgAddress = must(
  process.env.DEV_PG_ADDRESS,
  'DEV_PG_ADDRESS is required',
);

concurrently([
  {
    command: 'bun run dev:clean && bun run dev:db',
    name: 'pg',
    prefixColor: '#32648c',
  },
  {command: 'bun run dev:ui', name: 'ts', prefixColor: '#7ce645'},
  {
    command: `wait-on tcp:${devPgAddress} && sleep 1 && cd ../../packages/core && bun run db:push && cd ../../apps/web && bun run seed`,
    name: 'sd',
    prefixColor: '#ff5515',
  },
  {
    command: `wait-on tcp:${devPgAddress} && sleep 1 && bun run dev:zero`,
    name: 'z0',
    prefixColor: '#ff11cc',
  },
  {
    command:
      "chokidar '../../packages/core/src/db/schema.ts' '../../packages/core/src/auth/schema.ts' -c 'cd ../../packages/core && bun run zero:generate'",
    name: 'gz',
    prefixColor: '#11ffcc',
  },
]);
