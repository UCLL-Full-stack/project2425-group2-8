import { Ingredient } from "@/types/recipes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchMealDetails = async (date: string, token: string) => {
  console.log(`Fetching meal details for date: ${date} with token: ${token}`);
  const response = await fetch(`${apiUrl}/schedules?date=${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(`Response status: ${response.status}`);
  if (!response.ok) {
    console.error("Failed to fetch meal details", await response.text());
    throw new Error("Failed to fetch meal details");
  }

  const data = await response.json();
  console.log("Fetched meal details:", data);
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
  recipeId: number,
  oldDate: string,
  newDate: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${apiUrl}/schedules/${recipeId}?date=${oldDate}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

const deleteMeal = async (recipeId: number, date: string, token: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/schedules/${recipeId}?date=${date}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
