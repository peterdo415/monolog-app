import { getSession } from '@monolog/auth';
import { db, householdItems, itemCategories, units, locations, eq, InferSelectModel } from '@monolog/db';
import { Button, Card, CardContent, CardHeader, CardTitle, Plus } from "@monolog/ui";
import { NavBar } from "../components/NavBar";
// import { HouseholdForm } from "./HouseholdForm";

type ItemWithLabels = {
  id: number;
  name: string;
  quantity: number;
  lowStock: boolean;
  expiresAt: string;
  category: string;
  unit: string;
  location: string;
};

export default async function HouseholdPage() {
  const session = await getSession();
  if (!session?.user) {
    // SSRリダイレクト
    return <div>ログインが必要です</div>;
  }

  // household_itemsをJOINで取得
  const items = await db.select({
    id: householdItems.id,
    name: householdItems.name,
    quantity: householdItems.quantity,
    lowStockThreshold: householdItems.lowStockThreshold,
    expiresAt: householdItems.expiresAt,
    category: itemCategories.label,
    unit: units.label,
    location: locations.label,
  })
    .from(householdItems)
    .leftJoin(itemCategories, eq(householdItems.categoryId, itemCategories.id))
    .leftJoin(units, eq(householdItems.unitId, units.id))
    .leftJoin(locations, eq(householdItems.locationId, locations.id))
    .where(eq(householdItems.userId, session.user.id));

  // マスター取得
  const categories = await db.select().from(itemCategories);
  const unitList = await db.select().from(units);
  const locationList = await db.select().from(locations);

  const mappedItems: ItemWithLabels[] = items.map((item: any) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    lowStock: item.quantity <= item.lowStockThreshold,
    expiresAt: item.expiresAt ? String(item.expiresAt) : '',
    category: item.category?.ja || '',
    unit: item.unit?.ja || '',
    location: item.location?.ja || '',
  }));

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto py-10 px-4" style={{ marginTop: '64px' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">日用品管理</h1>
          {/* 新規追加はサーバーアクションで実装予定 */}
          <Button variant="default" size="sm" disabled>
            <Plus className="w-4 h-4 mr-2" /> 新規追加
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mappedItems.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">データがありません</div>
          ) : (
            mappedItems.map((item) => (
              <Card key={item.id} className="relative group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.lowStock && (
                      <span className="text-xs text-red-500 ml-2">在庫少</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm">
                    <div>
                      <span className="font-medium">カテゴリ:</span> {item.category}
                    </div>
                    <div>
                      <span className="font-medium">数量:</span> {item.quantity} {item.unit}
                    </div>
                    <div>
                      <span className="font-medium">場所:</span> {item.location}
                    </div>
                    <div>
                      <span className="font-medium">期限:</span> {item.expiresAt}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {/* 新規追加フォームはサーバーアクション化して後続対応 */}
        {/* <HouseholdForm categories={categories} units={unitList} locations={locationList} /> */}
      </main>
    </>
  );
} 