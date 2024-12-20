import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ingredient,
  IngredientCategory,
  Recipe,
  RecipeCategory,
} from "@/types/recipes";
import { Label } from "@/components/ui/label";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, "id">) => void;
  date: Date;
};

const AddNewMealPopup: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  date,
}) => {
  const [recipe, setRecipe] = useState<Omit<Recipe, "id">>({
    title: "",
    instructions: "",
    cookingTime: 0,
    category: "other",
    ingredients: [],
    user: { id: 0, username: "" },
  });

  const handleAddIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        {
          name: "",
          quantity: 0,
          unit: "",
          category: IngredientCategory.Other,
        },
      ],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleSave = () => {
    if (
      recipe.title.trim() &&
      recipe.instructions.trim() &&
      Number(recipe.cookingTime) > 0 &&
      recipe.category &&
      recipe.ingredients.length > 0 &&
      recipe.ingredients.every((ingredient) => Number(ingredient.quantity) > 0)
    ) {
      onSave({
        ...recipe,
        cookingTime: Number(recipe.cookingTime),
        ingredients: recipe.ingredients.map((ingredient) => ({
          ...ingredient,
          quantity: Number(ingredient.quantity),
        })),
      });
      onClose();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Meal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="title">Title</Label>
          <Input
            placeholder="Title"
            value={recipe.title}
            onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          />
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            placeholder="Instructions"
            value={recipe.instructions}
            onChange={(e) =>
              setRecipe({ ...recipe, instructions: e.target.value })
            }
          />
          <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
          <Input
            placeholder="Cooking Time (minutes)"
            value={recipe.cookingTime === 0 ? "" : recipe.cookingTime}
            onChange={(e) =>
              setRecipe({ ...recipe, cookingTime: parseInt(e.target.value) })
            }
          />
          <Label htmlFor="category">Category</Label>
          <Select
            value={recipe.category}
            onValueChange={(value: RecipeCategory) =>
              setRecipe({ ...recipe, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Label>Ingredients</Label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
              />
              <Input
                placeholder="Quantity"
                value={ingredient.quantity === 0 ? "" : ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(
                    index,
                    "quantity",
                    parseInt(e.target.value)
                  )
                }
              />
              <Input
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
              />
              <Button onClick={() => handleRemoveIngredient(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={handleAddIngredient}>Add Ingredient</Button>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewMealPopup;
