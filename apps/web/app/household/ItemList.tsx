import ItemCard from "./ItemCard";
export default function ItemList({ items, onEdit, onDelete }: { items: any[], onEdit: (item: any) => void, onDelete: (id: number) => void }) {
  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
      ))}
    </div>
  );
} 