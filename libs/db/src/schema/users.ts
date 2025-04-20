import { text, timestamp, unique } from 'drizzle-orm/pg-core';

import { commonColumns, createTable, uid } from '../helper';

export const usersTable = createTable(
  'users',
  {
    ...commonColumns,
    deletedAt: timestamp('deleted_at'),

    ...uid,

    username: text('username'),
    password: text('password'),
    displayName: text('display_name'),
    email: text('email'),
    firstName: text('first_name'),
    lastName: text('last_name'),
  },
  (t) => [unique().on(t.uid)],
);
