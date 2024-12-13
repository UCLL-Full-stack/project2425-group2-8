import { Ingredient } from "@/types/recipes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchMealDetails = async (userId: number, date: string) => {
  const response = await fetch(`${apiUrl}/schedules/${userId}/${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch meal details");
  }

  const data = await response.json();
  return data;
};

const fetchIngredientsForRecipes = async (
  recipeIds: number[]
): Promise<Ingredient[]> => {
  try {
    const response = await fetch(`${apiUrl}/recipes/ingredients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeIds }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

const updateMealDate = async (
  userId: number,
  recipeId: number,
  oldDate: string,
  newDate: string
) => {
  try {
    const response = await fetch(
      `${apiUrl}/schedules/${userId}/${recipeId}/${oldDate}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDate }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update meal date");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating meal date:", error);
    throw error;
  }
};

const deleteMeal = async (userId: number, recipeId: number, date: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/schedules/${userId}/${recipeId}/${date}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete meal");
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw error;
  }
};

const PlannerService = {
  fetchMealDetails,
  updateMealDate,
  deleteMeal,
  fetchIngredientsForRecipes,
};

export default PlannerService;
