import {drizzle} from 'drizzle-orm/node-postgres';
import {must} from '../shared/must';
import '@ztunes/env';

const pgURL = must(process.env.PG_URL, 'PG_URL is required');

export const db = drizzle(pgURL);
