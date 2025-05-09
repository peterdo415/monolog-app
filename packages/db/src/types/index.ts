/**
 * 新規挿入時に使用するUserモデルの型
 */
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from '../schema';

/**
 * DBから取得される User モデルの型
 */
export type User = InferSelectModel<typeof users>;

/**
 * 新規挿入時に使用する User モデルの型
 */
export type NewUser = InferInsertModel<typeof users>;
