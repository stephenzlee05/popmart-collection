
import { useState } from "react";
import { PopMartItem } from "@/types/collection";
import { ItemCard } from "@/components/ItemCard";
import { EditItemForm } from "@/components/EditItemForm";

interface CollectionGridProps {
  items: PopMartItem[];
  onUpdateItem: (id: string, updatedItem: Partial<PopMartItem>) => void;
  onDeleteItem: (id: string) => void;
}

export const CollectionGrid = ({ items, onUpdateItem, onDeleteItem }: CollectionGridProps) => {
  const [editingItem, setEditingItem] = useState<PopMartItem | null>(null);

  const handleEdit = (item: PopMartItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (updatedItem: Partial<PopMartItem>) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, updatedItem);
      setEditingItem(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => onDeleteItem(item.id)}
          />
        ))}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <EditItemForm
              item={editingItem}
              onSubmit={handleSaveEdit}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};
