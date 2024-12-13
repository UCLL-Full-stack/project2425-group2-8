import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import { Ingredient } from "@/types/recipes";
import IngredientQuantityControls from "./IngredientQuantityControls";
import IngredientRecipes from "./IngredientRecipes";

type Props = {
  ingredient: Ingredient & {
    recipes: Array<{
      recipeId: number;
      recipeTitle: string;
      quantity: number;
      unit: string;
    }>;
  };
  expandedId: number | null;
  editingId: number | null;
  onToggleExpand: (id: number) => void;
  onToggleCheck: (id: number) => void;
  onQuantityChange: (id: number, change: number) => void;
  onQuantityEdit: (id: number, newQuantity: string) => void;
  onDelete: (id: number) => void;
  setEditingId: (id: number | null) => void;
  shoppingListIngredients: Ingredient[];
};

const IngredientItem = ({
  ingredient,
  expandedId,
  editingId,
  onToggleExpand,
  onToggleCheck,
  onQuantityChange,
  onQuantityEdit,
  onDelete,
  setEditingId,
  shoppingListIngredients,
}: Props) => {
  const { id, name, checked, quantity, unit, recipes } = ingredient;

  return (
    <div className="flex flex-col py-2 group">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={checked}
            onCheckedChange={() => id !== undefined && onToggleCheck(id)}
            id={`checkbox-${id}`}
          />
          <label
            htmlFor={`checkbox-${id}`}
            className={`cursor-pointer ${
              checked ? "line-through text-gray-400" : ""
            }`}
          >
            {name}
          </label>
        </div>
        <div className="flex items-center">
          {id !== undefined && (
            <IngredientQuantityControls
              id={id}
              quantity={quantity}
              unit={unit}
              editingId={editingId}
              onQuantityChange={onQuantityChange}
              onQuantityEdit={onQuantityEdit}
              setEditingId={setEditingId}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => id !== undefined && onDelete(id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
          {recipes && recipes.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => id !== undefined && onToggleExpand(id)}
            >
              {expandedId === id ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
      {expandedId === id && recipes && recipes.length > 0 && (
        <IngredientRecipes recipes={recipes} ingredientId={id} unit={unit} />
      )}
    </div>
  );
};

export default IngredientItem;
