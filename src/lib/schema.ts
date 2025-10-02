import { pgTable, text, timestamp, boolean, jsonb, uuid, integer, primaryKey, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Better Auth 기본 테이블
export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').default(false),
  image: text('image'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const account = pgTable('account', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: uuid('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationToken = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
  // Composite primary key
  id: uuid('id').defaultRandom(),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
}));

// 커스텀 users 테이블 (Firestore 구조 기반)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  role: text('role').default('user'), // e.g., 'user', 'admin', 'packer'
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  emailVerified: boolean('emailVerified').default(false),
  provider: text('provider'),
  profile: jsonb('profile').default({}), // { firstName, lastName, phone, addresses: [] }
  preferences: jsonb('preferences').default({ newsletter: false, notifications: false }),
  cart: jsonb('cart').default('[]'),
  wishlist: jsonb('wishlist').default('[]'),
  orders: jsonb('orders').default('[]'),
});

// Orders 테이블
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: text('orderId').unique().notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  status: text('status').default('pending').notNull(),
  paymentStatus: text('paymentStatus').default('pending').notNull(),
  paymentMethod: text('paymentMethod').default('card').notNull(),
  customerEmail: text('customerEmail').notNull(),
  customerName: text('customerName'),
  shippingAddress: jsonb('shippingAddress'),
  billingAddress: jsonb('billingAddress'),
  items: jsonb('items').default('[]').notNull(),
  userEmail: text('userEmail'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// Relations (예시)
export const userRelations = relations(users, ({ one }) => ({
  authUser: one(user, {
    fields: [users.id],
    references: [user.id],
  }),
}));

// Better Auth 테이블 relations (필요 시 추가)
export const userAccounts = relations(user, ({ many }) => ({
  accounts: many(account),
}));

export const accountUser = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userSessions = relations(user, ({ many }) => ({
  sessions: many(session),
}));

export const sessionUser = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));