type Ingredient = {
  id?: number;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: string;
  store?: string;
};

type Recipe = {
  id?: number;
  title: string;
  instructions: string;
  cookingTime: number;
  category: RecipeCategory;
  ingredients: Ingredient[];
  user: {
    id: number;
    username: string;
  };
  imageUrl?: string;
  isFavorite?: boolean;
  notes?: string;
  source?: string;
  scheduledDate?: Date;
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

export type { Ingredient, Recipe, RecipeCategory };
export { IngredientCategory };
