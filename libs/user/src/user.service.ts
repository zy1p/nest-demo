import { QUERY_CLIENT, QueryClient } from '@lib/db';
import { usersTable } from '@lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(QUERY_CLIENT) private readonly queryClient: QueryClient,
  ) {}

  userCreateSchema = createInsertSchema(usersTable);
  userSelectSchema = createSelectSchema(usersTable);
  userUpdateSchema = createUpdateSchema(usersTable);

  async createUser(input: z.infer<typeof this.userCreateSchema>) {
    const values = this.userCreateSchema.parse(input);

    const user = await this.queryClient
      .insert(usersTable)
      .values(values)
      .returning();

    return user;
  }

  async listUsers([filter, ...config]: Parameters<
    typeof this.queryClient.query.usersTable.findMany
  >) {
    const users = await this.queryClient.query.usersTable.findMany(
      {
        orderBy: (t, op) => op.desc(t.createdAt),
        limit: 10,
        ...filter,
      },
      ...config,
    );

    return users;
  }

  async getUserById(id: number) {
    const user = await this.queryClient.query.usersTable.findFirst({
      where: (t, op) => op.eq(t.id, id),
    });

    return user;
  }

  async updateUser(id: number, input: z.infer<typeof this.userUpdateSchema>) {
    const values = this.userUpdateSchema.parse(input);

    const user = await this.queryClient
      .update(usersTable)
      .set(values)
      .where(eq(usersTable.id, id))
      .returning();

    return user;
  }

  async deleteUser(id: number) {
    const user = await this.queryClient
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return user;
  }
}
