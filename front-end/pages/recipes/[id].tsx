import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import RecipeService from "@/services/RecipeService";
import { Recipe } from "@/types/recipes";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeContent from "@/components/recipe/RecipeContent";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id && !Array.isArray(id)) {
        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
          setError("Invalid recipe ID");
          return;
        }
        try {
          const data = await RecipeService.fetchRecipeById(recipeId);
          setRecipe(data);
        } catch (error) {
          console.error("Error in fetchRecipe:", error);
          setError(
            `Failed to load recipe details: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }
    };

    if (router.isReady) {
      fetchRecipe();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = async (mealId: number, isFavorite: boolean) => {
    try {
      if (isNaN(mealId)) {
        throw new Error("Invalid meal ID");
      }
      const token = localStorage.getItem("token") || "";
      await RecipeService.updateRecipe(
        mealId,
        {
          isFavorite: !isFavorite,
        },
        token
      );
      const updatedRecipe = await RecipeService.fetchRecipeById(mealId);
      setRecipe(updatedRecipe);
    } catch (error) {
      setError(t("errorUpdatingMeal"));
    }
  };

  const handleDelete = async (mealId: number) => {
    try {
      const token = localStorage.getItem("token") || "";
      await RecipeService.deleteRecipe(mealId, token);
      router.back();
    } catch (error) {
      setError(t("errorDeletingMeal"));
    }
  };

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleBack}>Back</Button>
      </div>
    );

  if (!recipe)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-4">Recipe not found</p>
        <Button onClick={handleBack}>Back</Button>
      </div>
    );

  return (
    <section className="min-h-screen">
      <RecipeHeader
        isFavorite={recipe.isFavorite ?? false}
        onBack={handleBack}
        onToggleFavorite={() =>
          handleToggleFavorite(recipe!.id, recipe!.isFavorite ?? false)
        }
        onDelete={() => handleDelete(recipe!.id)}
      />
      <main className="container mx-auto px-4 py-8">
        <RecipeContent recipe={recipe} />
      </main>
    </section>
  );
}
