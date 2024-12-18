import { Recipe } from "@/types/recipes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchRecipeById = async (recipeId: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await fetch(`${apiUrl}/recipes/${recipeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
};

const updateRecipe = async (
  recipeId: number,
  updateData: Partial<Recipe>,
  token: string
) => {
  try {
    const response = await fetch(`${apiUrl}/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error("Failed to update recipe");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

const deleteRecipe = async (recipeId: number, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/recipes/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

const RecipeService = { fetchRecipeById, updateRecipe, deleteRecipe };

export default RecipeService;
