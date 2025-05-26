import HouseholdForm from "./HouseholdForm";
export default function HouseholdFormModal({ master, initialData, onSubmit, onClose }: { master: any, initialData?: any, onSubmit: (data: any) => void, onClose: () => void }) {
  // モーダルUIでラップ（簡易例）
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg min-w-[320px]">
        <HouseholdForm master={master} initialData={initialData} onSubmit={onSubmit} onClose={onClose} />
      </div>
    </div>
  );
} 