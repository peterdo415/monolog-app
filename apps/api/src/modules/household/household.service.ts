import { Injectable, BadRequestException } from '@nestjs/common';
import { db } from '@monolog/db/client';
import { users, householdItems, itemCategories, units, locations } from '@monolog/db/schema';
import { eq, type SQL, type InferSelectModel } from '@monolog/db';
import { CreateHouseholdDto } from '../../dto/create-household.dto.js';


type HouseholdItem = InferSelectModel<typeof householdItems>;
type ItemCategory = InferSelectModel<typeof itemCategories>;
type Unit = InferSelectModel<typeof units>;
type Location = InferSelectModel<typeof locations>;

interface HouseholdItemWithRelations extends HouseholdItem {
  category: ItemCategory['label'];
  unit: Unit['label'];
  location: Location['label'];
}

@Injectable()
export class HouseholdService {
  async create(dto: CreateHouseholdDto) {
    // 型チェック&キャスト
    ["categoryId", "unitId", "locationId", "quantity"].forEach((key) => {
      const value = dto[key];
      if (typeof value !== "number") {
        if (/^\d+$/.test(String(value))) {
          dto[key] = Number(value);
        } else {
          throw new BadRequestException(`${key}は数値で入力してください`);
        }
      }
    });
    // userEmailからuserId取得
    const user = await db.select().from(users).where(eq(users.email, dto.userEmail)).then((rows: any[]) => rows[0]);
    if (!user) throw new BadRequestException('ユーザーが見つかりません');
    // householdItemsにinsert
    const [item] = await db.insert(householdItems).values({
      userId: user.id,
      name: dto.name,
      categoryId: dto.categoryId,
      unitId: dto.unitId,
      locationId: dto.locationId,
      quantity: dto.quantity,
      // 必要に応じて他のカラムも追加
    }).returning();
    return item;
  }

  async findAll(userEmail: string): Promise<HouseholdItemWithRelations[]> {
    // userEmailからuserId取得
    const user = await db.select().from(users).where(eq(users.email, userEmail)).then((rows: any[]) => rows[0]);
    if (!user) throw new BadRequestException('ユーザーが見つかりません');
    // householdItemsをJOINで取得
    const items = await db
      .select({
        id: householdItems.id,
        userId: householdItems.userId,
        categoryId: householdItems.categoryId,
        unitId: householdItems.unitId,
        locationId: householdItems.locationId,
        name: householdItems.name,
        quantity: householdItems.quantity,
        lowStockThreshold: householdItems.lowStockThreshold,
        purchasedAt: householdItems.purchasedAt,
        expiresAt: householdItems.expiresAt,
        notifyBeforeDays: householdItems.notifyBeforeDays,
        notifyEnabled: householdItems.notifyEnabled,
        archivedAt: householdItems.archivedAt,
        createdAt: householdItems.createdAt,
        updatedAt: householdItems.updatedAt,
        category: itemCategories.label,
        unit: units.label,
        location: locations.label,
      })
      .from(householdItems)
      .leftJoin(itemCategories, eq(householdItems.categoryId, itemCategories.id))
      .leftJoin(units, eq(householdItems.unitId, units.id))
      .leftJoin(locations, eq(householdItems.locationId, locations.id))
      .where(eq(householdItems.userId, user.id));
    return items;
  }

  async update(id: number, dto: any) {
    ["categoryId", "unitId", "locationId", "quantity"].forEach((key) => {
      const value = dto[key];
      if (typeof value !== "number") {
        if (/^\d+$/.test(String(value))) {
          dto[key] = Number(value);
        } else {
          throw new BadRequestException(`${key}は数値で入力してください`);
        }
      }
    });
    // householdItemsのidで該当レコードを更新
    const [item] = await db.update(householdItems)
      .set({
        name: dto.name,
        categoryId: dto.categoryId,
        unitId: dto.unitId,
        locationId: dto.locationId,
        quantity: dto.quantity,
        // 必要に応じて他のカラムも追加
        updatedAt: new Date(),
      })
      .where(eq(householdItems.id, id))
      .returning();
    return item;
  }

  async remove(id: number, userEmail: string) {
    // userEmailからuserId取得
    const user = await db.select().from(users).where(eq(users.email, userEmail)).then((rows: any[]) => rows[0]);
    if (!user) throw new BadRequestException('ユーザーが見つかりません');
    // household_itemがそのユーザーのものかチェック
    const item = await db.select().from(householdItems).where(eq(householdItems.id, id)).then((rows: any[]) => rows[0]);
    if (!item || item.userId !== user.id) throw new BadRequestException('権限がありません');
    // 削除
    const [deleted] = await db.delete(householdItems).where(eq(householdItems.id, id)).returning();
    return deleted;
  }
} 