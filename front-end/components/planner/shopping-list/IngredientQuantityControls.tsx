import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

type Props = {
  id: number;
  quantity: number;
  unit: string;
  editingId: number | null;
  onQuantityChange: (id: number, change: number) => void;
  onQuantityEdit: (id: number, newQuantity: string) => void;
  setEditingId: (id: number | null) => void;
};

const IngredientQuantityControls = ({
  id,
  quantity,
  unit,
  editingId,
  onQuantityChange,
  onQuantityEdit,
  setEditingId,
}: Props) => {
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onQuantityChange(id, -1)}
      >
        <Minus className="h-3 w-3" />
      </Button>
      {editingId === id ? (
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={quantity}
          onChange={(e) => onQuantityEdit(id, e.target.value)}
          onBlur={() => setEditingId(null)}
          className="w-16 h-6 text-center"
          autoFocus
        />
      ) : (
        <span
          className="w-16 text-center cursor-pointer"
          onClick={() => setEditingId(id)}
          data-ingredient-id={id}
        >
          {quantity} {unit}
        </span>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        onClick={() => onQuantityChange(id, 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default IngredientQuantityControls;
