import type { QueryClient } from '@lib/db';
import { QUERY_CLIENT } from '@lib/db';
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

  static userCreateSchema = createInsertSchema(usersTable, {
    email: z.string().email(),
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(100),
  })
    .required({
      username: true,
      password: true,
      email: true,
    })
    .pick({
      username: true,
      password: true,
      email: true,
      firstName: true,
      lastName: true,
    });

  static userSelectSchema = createSelectSchema(usersTable);
  static userUpdateSchema = createUpdateSchema(usersTable);

  async createUser(input: z.infer<typeof UserService.userCreateSchema>) {
    const user = await this.queryClient
      .insert(usersTable)
      .values(input)
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

  async getUserByEmail(email: string) {
    const user = await this.queryClient.query.usersTable.findFirst({
      where: (t, op) => op.eq(t.email, email),
    });

    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.queryClient.query.usersTable.findFirst({
      where: (t, op) => op.eq(t.username, username),
    });

    return user;
  }

  async updateUser(
    id: number,
    input: z.infer<typeof UserService.userUpdateSchema>,
  ) {
    const values = UserService.userUpdateSchema.parse(input);

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
