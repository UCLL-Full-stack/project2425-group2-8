import { useRouter } from "next/router";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeContent from "@/components/recipe/RecipeContent";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { useRecipe } from "@/hooks/useRecipe";

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const { recipe, isLoading, isError } = useRecipe(id);
  const { t } = useTranslation("common");

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
      // Revalidate SWR cache
      mutate(`/api/recipes/${mealId}`);
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

  if (isError)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{isError.message}</p>
        <Button onClick={handleBack}>Back</Button>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-4">Loading...</p>
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
