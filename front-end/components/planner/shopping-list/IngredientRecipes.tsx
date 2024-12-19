import { Recipe, Ingredient } from "@/types/recipes";

type Props = {
  recipes: Array<{
    recipeId: number;
    recipeTitle: string;
    ingredients: Array<{
      ingredient: Ingredient;
      quantity: number;
      unit: string;
    }>;
  }>;
  ingredientId: number;
};

const IngredientRecipes = ({ recipes, ingredientId }: Props) => {
  return (
    <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
      <div className="text-xs text-muted-foreground mb-2">Used in recipes:</div>
      {recipes.map((recipe) => {
        const recipeIngredient = recipe.ingredients?.find(
          (ri) => ri.ingredient.id === ingredientId
        );
        return (
          <div
            key={`${recipe.recipeId}-${ingredientId}`}
            className="flex items-center justify-between text-sm py-1"
          >
            <span className="text-gray-700">
              {recipe.recipeTitle || "Untitled Recipe"}
            </span>
            <span className="text-gray-500">
              {recipeIngredient
                ? `${recipeIngredient.quantity} ${recipeIngredient.unit}`
                : `0`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default IngredientRecipes;
