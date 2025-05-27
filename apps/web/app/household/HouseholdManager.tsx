'use client';
import { useState, useEffect } from "react";
import ItemList from "./ItemList";
import HouseholdFormModal from "./HouseholdFormModal";

export default function HouseholdManager({ master, userEmail }: { master: any, userEmail: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: "add" | "edit", item?: any } | null>(null);

  useEffect(() => {
    fetch(`/api/household?userEmail=${encodeURIComponent(userEmail)}`)
      .then(res => res.ok ? res.json() : [])
      .then(setItems);
  }, [userEmail]);

  const handleAdd = async (data: any) => {
    const res = await fetch("/api/household", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, userEmail }) });
    if (res.ok) {
      const newItem = await res.json();
      setItems(prev => [...prev, newItem]);
      setModal(null);
    }
  };

  const handleEdit = async (id: number, data: any) => {
    const res = await fetch(`/api/household/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, userEmail }) });
    if (res.ok) {
      const updated = await res.json();
      setItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
      setModal(null);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/household/${id}?userEmail=${encodeURIComponent(userEmail)}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(item => Number(item.id) !== Number(id)));
    }
  };

  return (
    <>
      <button onClick={() => setModal({ type: "add" })}>新規追加</button>
      <ItemList items={items} onEdit={item => setModal({ type: "edit", item })} onDelete={handleDelete} />
      {modal && (
        <HouseholdFormModal
          master={master}
          initialData={modal.type === "edit" ? modal.item : undefined}
          onSubmit={modal.type === "add"
            ? handleAdd
            : (data) => handleEdit(modal.item.id, data)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
} 