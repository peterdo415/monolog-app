import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import {
  integer,
  bigint,
  jsonb,
  boolean,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  emailKey: uniqueIndex('users_email_key').on(table.email),
}));

// マスター: カテゴリ
export const itemCategories = pgTable("item_categories", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  label: jsonb("label").notNull(), // { ja: "トイレットペーパー", en: "Toilet Paper" } など
});

// マスター: 単位
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  label: jsonb("label").notNull(),
});

// マスター: 置き場所
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  label: jsonb("label").notNull(),
});

// household_items テーブル
export const householdItems = pgTable(
  "household_items",
  {
    id: serial("id").primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => itemCategories.id, { onDelete: "restrict" }),
    unitId: integer("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "restrict" }),
    locationId: integer("location_id")
      .references(() => locations.id, { onDelete: "set null" }),
    name: varchar("name", { length: 100 }).notNull(),
    quantity: integer("quantity").notNull().default(1), // CHECK(quantity >= 0)はアプリ側で担保
    lowStockThreshold: integer("low_stock_threshold").notNull().default(0), // CHECKも同上
    purchasedAt: date("purchased_at"),
    expiresAt: date("expires_at"),
    notifyBeforeDays: integer("notify_before_days").notNull().default(3),
    notifyEnabled: boolean("notify_enabled").notNull().default(true),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIndex: index("idx_items_user").on(table.userId),
    expiryIndex: index("idx_items_expiry").on(table.userId, table.expiresAt),
    lowstockIndex: index("idx_items_lowstock").on(table.userId, table.quantity),
    uniqueItem: uniqueIndex("uq_user_item_location").on(table.userId, table.name, table.locationId),
  })
);

// 補足: updatedAtの自動更新はアプリ側またはDBトリガーで担保してください。
