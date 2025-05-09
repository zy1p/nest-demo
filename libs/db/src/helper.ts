import { sql } from 'drizzle-orm';
import {
  pgTable,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => sql`now()`),
};

export const commonColumns = {
  id: serial('id').primaryKey(),
  ...timestamps,
};

export const uid = {
  uid: uuid('uid').defaultRandom(),
};

export const createTable =
  process.env.NODE_ENV !== 'production'
    ? pgTableCreator((name) => `dev_${name}`)
    : pgTable;
