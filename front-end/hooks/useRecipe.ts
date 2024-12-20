import useSWR from "swr";
import RecipeService from "@/services/RecipeService";
import { Recipe } from "@/types/recipes";

const fetcher = (url: string) =>
  RecipeService.fetchRecipeById(parseInt(url.split("/").pop()!, 10));

export const useRecipe = (id: string | string[] | undefined) => {
  const { data, error } = useSWR(id ? `/api/recipes/${id}` : null, fetcher);

  return {
    recipe: data as Recipe | undefined,
    isLoading: !error && !data,
    isError: error,
  };
};
