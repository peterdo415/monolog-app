/**
 * 新規挿入時に使用するUserモデルの型
 */
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, householdItems } from '../schema/index.js';

/**
 * DBから取得される User モデルの型
 */
export type User = InferSelectModel<typeof users>;

/**
 * 新規挿入時に使用する User モデルの型
 */
export type NewUser = InferInsertModel<typeof users>;

/**
 * DBから取得される HouseholdItem モデルの型
 */
export type HouseholdItem = InferSelectModel<typeof householdItems>;

/**
 * 新規挿入時に使用する HouseholdItem モデルの型
 */
export type NewHouseholdItem = InferInsertModel<typeof householdItems>;
