type Ingredient = {
  id?: number;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: string;
  store?: string;
  checked?: boolean;
  recipes: Recipe[];
};

type RecipeIngredient = {
  ingredient: Ingredient;
  unit: string;
  quantity: number;
  checked?: boolean;
};

type Recipe = {
  recipeId: number;
  recipeTitle: string;
  instructions: string;
  cookingTime: number;
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  user: {
    id: number;
    username: string;
  };
  imageUrl: string;
  isFavorite: boolean;
  notes?: string;
  source?: string;
};

type RecipeCategory = "breakfast" | "lunch" | "dinner" | "snack" | "other";

enum IngredientCategory {
  Produce = "Produce",
  MeatAndFish = "Meat & Fish",
  DairyAndEggs = "Dairy & Eggs",
  Pantry = "Pantry",
  Snacks = "Snacks",
  Beverages = "Beverages",
  Frozen = "Frozen",
  Other = "Other",
}

export type { Ingredient, RecipeIngredient, Recipe };
export { IngredientCategory };
