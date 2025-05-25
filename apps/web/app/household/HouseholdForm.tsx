"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Button } from "@monolog/ui";

// 仮のマスター値（本来はAPI取得）
const categories = [
  { id: 1, label: "清掃用品" },
  { id: 2, label: "食品" },
  { id: 3, label: "日用品" },
];
const units = [
  { id: 1, label: "個" },
  { id: 2, label: "本" },
  { id: 3, label: "枚" },
];
const locations = [
  { id: 1, label: "キッチン" },
  { id: 2, label: "浴室" },
  { id: 3, label: "リビング" },
];

export function HouseholdForm({ open, onOpenChange, onSubmit, loading }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    categoryId: categories.length > 0 ? categories[0].id : 1,
    unitId: units.length > 0 ? units[0].id : 1,
    locationId: locations.length > 0 ? locations[0].id : 1,
    quantity: 1,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === "quantity" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("名前は必須です");
      return;
    }
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>日用品を追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名前<span className="text-red-500">*</span></label>
            <Input name="name" value={form.name} onChange={handleChange} required maxLength={100} autoFocus />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">カテゴリ</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-2 py-1">
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">単位</label>
              <select name="unitId" value={form.unitId} onChange={handleChange} className="w-full border rounded px-2 py-1">
                {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">数量</label>
              <Input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">場所</label>
              <select name="locationId" value={form.locationId} onChange={handleChange} className="w-full border rounded px-2 py-1">
                {locations.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>キャンセル</Button>
            <Button type="submit" variant="default" disabled={loading}>{loading ? "追加中..." : "追加"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 