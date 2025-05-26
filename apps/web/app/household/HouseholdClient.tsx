"use client";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Plus, Pencil, Trash2 } from "@monolog/ui";
import { NavBar } from "../components/NavBar";
import { useModal } from "../hooks/useModal";
import { Modal } from "../components/Modal";
import { HouseholdForm } from "./HouseholdForm";

export function HouseholdClient({ master, initialItems, userEmail }: {
  master: { categories: any[]; units: any[]; locations: any[] };
  initialItems: any[];
  userEmail: string;
}) {
  const { open, openModal, closeModal } = useModal();
  const { open: editOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>(initialItems);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch(`/api/household?userEmail=${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    }
  };

  const handleAdd = async (data: any) => {
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
    if (!editItem) return;
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
      setItems(prev => prev.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item));
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
    if (!deleteTarget) return;
    setLoading(true);
    const res = await fetch(`/api/household/${deleteTarget.id}?userEmail=${encodeURIComponent(userEmail)}`, {
      method: 'DELETE',
    });
    setLoading(false);
    if (res.ok) {
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchItems();
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
                      <span className="font-medium">カテゴリ:</span> {typeof item.category === 'object' && item.category !== null ? item.category.ja : item.category}
                    </div>
                    <div>
                      <span className="font-medium">数量:</span> {item.quantity} {typeof item.unit === 'object' && item.unit !== null ? item.unit.ja : item.unit}
                    </div>
                    <div>
                      <span className="font-medium">場所:</span> {typeof item.location === 'object' && item.location !== null ? item.location.ja : item.location}
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
              initialData={editItem}
              onSubmit={handleEdit}
              loading={loading}
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