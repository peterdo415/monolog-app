export default function ItemCard({ item, onEdit, onDelete }: { item: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="border rounded p-4 mb-2 flex justify-between items-center">
      <div>
        <div className="font-bold">{item.name}</div>
        <div>カテゴリ: {item.category}</div>
        <div>数量: {item.quantity} {item.unit}</div>
        <div>場所: {item.location}</div>
        <div>期限: {item.expiresAt}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit}>編集</button>
        <button onClick={onDelete}>削除</button>
      </div>
    </div>
  );
} 