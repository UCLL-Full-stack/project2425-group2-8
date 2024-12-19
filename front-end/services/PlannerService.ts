import { Recipe } from "@/types/recipes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchMealDetails = async (date: string, token: string) => {
  const response = await fetch(`${apiUrl}/schedules?date=${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch meal details");
  }

  return await response.json();
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

const deleteScheduledMeal = async (
  recipeId: number,
  date: string,
  token: string
) => {
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

const copyMeals = async (
  dateString: string,
  token: string
): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${apiUrl}/schedules/copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: dateString }),
    });

    if (!response.ok) {
      throw new Error("Failed to copy meals");
    }

    return await response.json();
  } catch (error) {
    console.error("Error copying meals:", error);
    throw error;
  }
};

const pasteMeals = async (
  sourceDateString: string,
  targetDateString: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/schedules/paste`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sourceDate: sourceDateString,
        targetDate: targetDateString,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to paste meals");
    }
  } catch (error) {
    console.error("Error pasting meals:", error);
    throw error;
  }
};

const saveNewMeal = async (recipe: Recipe, date: string, token: string) => {
  const response = await fetch(`${apiUrl}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...recipe, scheduledDate: date }),
  });

  if (!response.ok) {
    throw new Error("Failed to save new meal");
  }

  return await response.json();
};

const getExistingMeals = async (token: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${apiUrl}/recipes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch existing meals");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching existing meals:", error);
    throw error;
  }
};

const scheduleExistingMeal = async (
  recipeId: number,
  date: string,
  token: string
) => {
  try {
    const response = await fetch(`${apiUrl}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipeId, date }),
    });

    if (!response.ok) {
      throw new Error("Failed to schedule existing meal");
    }

    return await response.json();
  } catch (error) {
    console.error("Error scheduling existing meal:", error);
    throw error;
  }
};

const getFavoriteMeals = async (token: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${apiUrl}/recipes?favorite=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorite meals");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite meals:", error);
    throw error;
  }
};

const PlannerService = {
  fetchMealDetails,
  updateMealDate,
  deleteMeal: deleteScheduledMeal,
  copyMeals,
  pasteMeals,
  saveNewMeal,
  scheduleExistingMeal,
  getExistingMeals,
  getFavoriteMeals,
};

export default PlannerService;
