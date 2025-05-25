// // export * from './client';
// // export * from './schema/index';
// export * from './client.js';
// export * from './schema/index.js';
// // export { eq, and, or, not, sql } from 'drizzle-orm';
// // export type { InferSelectModel, InferInsertModel, SQL } from 'drizzle-orm';
// // export type { InferSelectModel, InferInsertModel } from 'drizzle-orm'; 
// // export { householdItems, itemCategories, units, locations } from './schema/index.js';
export * from './client/index.js';
export * from './schema/index.js';
export * from './types/index.js';
export { eq, and, or, not } from 'drizzle-orm';
export { sql } from 'drizzle-orm/sql';
export type { SQL } from 'drizzle-orm/sql';
export type { InferSelectModel, InferInsertModel, InferModel } from 'drizzle-orm';
export { db } from './client/index.js'; // re-export db