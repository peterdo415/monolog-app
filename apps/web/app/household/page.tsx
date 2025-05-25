"use client";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Plus } from "@monolog/ui";
import { NavBar } from "../components/NavBar";
import { HouseholdForm } from "./HouseholdForm";

// 仮のデータ
const dummyItems = [
  {
    id: 1,
    name: "トイレットペーパー",
    quantity: 8,
    lowStock: false,
    expiresAt: "2024-12-31",
    category: "日用品",
    unit: "個",
    location: "キッチン",
  },
];

export default function HouseholdPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(dummyItems);

  // householdItems追加のダミー
  const handleAdd = async (data: any) => {
    setLoading(true);
    // 本来はAPI経由で追加
    setTimeout(() => {
      setItems(prev => [...prev, { ...data, id: prev.length + 1, lowStock: false, expiresAt: "", category: "", unit: "", location: "" }]);
      setLoading(false);
      setOpen(false);
    }, 800);
  };

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto py-10 px-4" style={{ marginTop: '64px' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">日用品管理</h1>
          <Button variant="default" size="sm" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> 新規追加
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">データがありません</div>
          ) : (
            items.map((item) => (
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
        <HouseholdForm open={open} onOpenChange={setOpen} onSubmit={handleAdd} loading={loading} />
      </main>
    </>
  );
} 