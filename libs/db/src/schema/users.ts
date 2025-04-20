import { timestamp, unique } from 'drizzle-orm/pg-core';

import { commonColumns, createTable, uid } from '../helper';

export const usersTable = createTable(
  'users',
  {
    ...commonColumns,
    deletedAt: timestamp('deleted_at'),

    ...uid,
  },
  (t) => [unique().on(t.uid)],
);
