"use client";
import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Plus, Pencil, Trash2 } from "@monolog/ui";
import { NavBar } from "../components/NavBar";
import { useModal } from "../hooks/useModal";
import { Modal } from "../components/Modal";
import { useRouter } from 'next/navigation';

type HouseholdFormState = {
  name: string;
  categoryId: number;
  unitId: number;
  locationId: number;
  quantity: number;
  expiresAt: string;
};

export function HouseholdForm({ master, onSubmit, loading, error, initialData, onClose }: {
  master: { categories: any[]; units: any[]; locations: any[] };
  onSubmit: (data: HouseholdFormState) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  initialData?: any;
  onClose: () => void;
}) {
  const [form, setForm] = useState<HouseholdFormState>({
    name: initialData?.name ?? "",
    categoryId: initialData?.categoryId ?? (master.categories.length > 0 ? master.categories[0].id : 1),
    unitId: initialData?.unitId ?? (master.units.length > 0 ? master.units[0].id : 1),
    locationId: initialData?.locationId ?? (master.locations.length > 0 ? master.locations[0].id : 1),
    quantity: initialData?.quantity ?? 1,
    expiresAt: initialData?.expiresAt ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (["categoryId", "unitId", "locationId", "quantity"].includes(name)) {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 型チェック&キャスト
    const castedForm = { ...form };
    ["categoryId", "unitId", "locationId", "quantity"].forEach((key) => {
      const value = form[key as keyof typeof form];
      if (typeof value !== "number") {
        // 数字文字列ならキャスト
        if (/^\d+$/.test(String(value))) {
          castedForm[key as keyof typeof form] = Number(value);
        } else {
          alert(`${key}は数値で入力してください`);
          return;
        }
      }
    });
    await onSubmit(castedForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">名前</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div>
          <label className="block font-medium mb-1">カテゴリ</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {master.categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.label.ja}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">単位</label>
          <select name="unitId" value={form.unitId} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {master.units.map((unit: any) => (
              <option key={unit.id} value={unit.id}>{unit.label.ja}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">場所</label>
          <select name="locationId" value={form.locationId} onChange={handleChange} className="w-full border rounded px-2 py-1">
            {master.locations.map((loc: any) => (
              <option key={loc.id} value={loc.id}>{loc.label.ja}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">数量</label>
          <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
        </div>
        <div>
          <label className="block font-medium mb-1">期限</label>
          <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={onClose}>キャンセル</Button>
        <Button type="submit" disabled={loading}>{loading ? "保存中..." : "保存"}</Button>
      </div>
    </form>
  );
}

export function HouseholdFormContainer({ master }: { master: { categories: any[]; units: any[]; locations: any[] } }) {
  const { open, openModal, closeModal } = useModal();
  const { open: editOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUserEmail(data?.user?.email ?? null);
        setSessionChecked(true);
      });
  }, []);

  useEffect(() => {
    if (sessionChecked && !userEmail) {
      router.push('/login?from=household');
    }
  }, [sessionChecked, userEmail, router]);

  const fetchItems = async (email: string) => {
    const res = await fetch(`/api/household?userEmail=${encodeURIComponent(email)}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  useEffect(() => {
    if (userEmail) fetchItems(userEmail);
  }, [userEmail]);

  const handleAdd = async (data: any) => {
    if (!userEmail) return;
    setLoading(true);
    setAddError(null);
    const res = await fetch('/api/household', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userEmail }),
    });
    setLoading(false);
    if (res.ok) {
      const newItem = await res.json();
      setItems(prev => [...prev, newItem]);
      closeModal();
    } else {
      setAddError('追加に失敗しました。もう一度お試しください。');
    }
  };

  const handleEdit = async (data: any) => {
    if (!userEmail || !editItem) return;
    setLoading(true);
    const res = await fetch(`/api/household/${editItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userEmail }),
    });
    setLoading(false);
    if (res.ok) {
      const updatedItem = await res.json();
      closeEditModal();
      setEditItem(null);
      setItems(prev =>
        prev.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item)
      );
    }
  };

  const handleEditClick = (item: any) => {
    setEditItem(item);
    openEditModal();
  };

  const handleDeleteClick = (item: any) => {
    setDeleteTarget(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !userEmail) return;
    setLoading(true);
    const idToDelete = deleteTarget.id;
    const res = await fetch(`/api/household/${idToDelete}?userEmail=${encodeURIComponent(userEmail)}`, {
      method: 'DELETE',
    });
    setLoading(false);
    if (res.ok) {
      setDeleteOpen(false);
      setItems(prev => prev.filter(item => item.id !== idToDelete));
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <NavBar />
      <main className="max-w-4xl mx-auto py-10 px-4" style={{ marginTop: '64px' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">日用品管理</h1>
          <Button variant="default" size="sm" onClick={openModal}>
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
                    <div className="flex items-center gap-2">
                      {item.lowStock && (
                        <span className="text-xs text-red-500 ml-2">在庫少</span>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => handleEditClick(item)} aria-label="編集">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(item)} aria-label="削除">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
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
        {/* HouseholdForm（追加・編集用） */}
        <Modal open={open} onClose={closeModal}>
          <HouseholdForm
            master={master}
            onSubmit={handleAdd}
            loading={loading}
            error={addError}
            onClose={closeModal}
          />
        </Modal>
        {editItem && (
          <Modal open={editOpen} onClose={closeEditModal}>
            <HouseholdForm
              master={master}
              onSubmit={handleEdit}
              loading={loading}
              error={addError}
              initialData={editItem}
              onClose={closeEditModal}
            />
          </Modal>
        )}
        <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <div className="text-center">
            <h2 className="text-lg font-bold mb-4">本当に削除しますか？</h2>
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="ghost" onClick={() => setDeleteOpen(false)}>キャンセル</Button>
              <Button variant="destructive" onClick={handleDelete}>削除する</Button>
            </div>
          </div>
        </Modal>
      </main>
    </>
  );
} 