"use client";
import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Plus, Pencil, Trash2 } from "@monolog/ui";
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

const numberKeys: (keyof Pick<HouseholdFormState, 'categoryId' | 'unitId' | 'locationId' | 'quantity'>)[] = [
  'categoryId',
  'unitId',
  'locationId',
  'quantity',
];

export function HouseholdForm({ master, onSubmit, loadingType, error, initialData, onClose }: {
  master: { categories: any[]; units: any[]; locations: any[] };
  onSubmit: (data: HouseholdFormState) => Promise<void>;
  loadingType?: 'add' | 'edit' | 'delete' | null;
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
    numberKeys.forEach((key) => {
      const value = form[key];
      if (typeof value !== "number") {
        // 数字文字列ならキャスト
        if (/^\d+$/.test(String(value))) {
          castedForm[key] = Number(value);
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
        <Button type="submit" disabled={loadingType === 'add' || loadingType === 'edit'}>
          {loadingType === 'add' && '追加中...'}
          {loadingType === 'edit' && '保存中...'}
          {!loadingType && '保存'}
        </Button>
      </div>
    </form>
  );
}

export function HouseholdFormContainer({ master, onSubmit, loading, error, initialData, onClose }: {
  master: { categories: any[]; units: any[]; locations: any[] };
  onSubmit: (data: HouseholdFormState) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  initialData?: any;
  onClose: () => void;
}) {
  return (
    <Modal open={true} onClose={onClose}>
      <HouseholdForm
        master={master}
        onSubmit={onSubmit}
        loadingType={loading}
        error={error}
        initialData={initialData}
        onClose={onClose}
      />
    </Modal>
  );
} 