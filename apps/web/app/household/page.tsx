'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Plus } from "@monolog/ui";
import { NavBar } from "../components/NavBar";
import { db, householdItems, itemCategories, units, locations, users } from '@monolog/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export default function HouseholdPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data?.user) {
          router.replace('/login');
        } else {
          setUser(data.user);
          // householdアイテムも取得
          fetch('/api/household')
            .then(res => res.ok ? res.json() : [])
            .then(setItems);
        }
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  const mappedItems = items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    lowStock: item.quantity <= item.lowStockThreshold,
    expiresAt: item.expiresAt ? String(item.expiresAt) : '',
    category: (item.category as { ja?: string })?.ja || '',
    unit: (item.unit as { ja?: string })?.ja || '',
    location: (item.location as { ja?: string })?.ja || '',
  }));

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto py-10 px-4" style={{ marginTop: '64px' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">日用品管理</h1>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" /> 新規追加
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mappedItems.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">データがありません</div>
          ) : (
            mappedItems.map((item: any) => (
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
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <Button size="icon" variant="ghost" className="mr-2">
                      <span className="sr-only">編集</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9.293-9.293a1 1 0 0 0-1.414-1.414L9 13.586V21z"/></svg>
                    </Button>
                    <Button size="icon" variant="destructive">
                      <span className="sr-only">削除</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </>
  );
} 