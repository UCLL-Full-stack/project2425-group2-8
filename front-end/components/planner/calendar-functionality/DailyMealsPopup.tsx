/*
 * Parent component of DailyMealsView and SingleMealCard.
 * MealsDayPopup component displays a popup with a list of meals for a specific day.
 * It fetches meal details based on the user ID and date, and provides actions for deleting meals.
 */

import { useState, useEffect, useCallback } from "react";
import PlannerService from "@/services/PlannerService";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import DailyMealsView from "./DailyMealsView";
import SingleMealView from "./SingleMealCard";
import { Recipe } from "@/types/recipes";
import RecipeService from "@/services/RecipeService";

type Props = {
  userId: number;
  date: Date;
  onClose: () => void;
};

const DailyMealsPopup: React.FC<Props> = ({ userId, date, onClose }) => {
  const [meals, setMeals] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Convert date to UTC and format as YYYY-MM-DD --> to handle date issues
  const formatDateUTC = (date: Date) => {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    return utcDate.toISOString().split("T")[0];
  };

  // to refresh after changes (delete or update) --> useCallback: only changes if one of the inputs has changed
  const fetchMeals = useCallback(async () => {
    try {
      const dateString = formatDateUTC(date);
      const token = localStorage.getItem("token") || "";
      const meals = await PlannerService.fetchMealDetails(dateString, token);
      setMeals(meals);
    } catch (error) {
      setError("Error fetching meals");
    }
  }, [date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDelete = async (mealId: number) => {
    try {
      const token = localStorage.getItem("token") || "";
      await PlannerService.deleteMeal(mealId, formatDateUTC(date), token);
      await fetchMeals(); // fetch again after deleting
    } catch (error) {
      setError("Error deleting meal");
    }
  };

  const handleToggleFavorite = async (mealId: number, isFavorite: boolean) => {
    try {
      const token = localStorage.getItem("token") || "";
      await RecipeService.updateRecipe(
        mealId,
        {
          isFavorite: !isFavorite,
        },
        token
      );
      await fetchMeals(); // fetch again after updating
    } catch (error) {
      setError("Error updating meal");
    }
  };

  const formatDate = (date: Date) => {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${weekday}, ${day}/${month}/${year}`;
  };

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const categoryOrder = ["breakfast", "lunch", "dinner", "snack"];

  // create new array ordered by categories
  const allMeals = categoryOrder
    .flatMap((category) =>
      meals.filter((meal) => meal.category.toLowerCase() === category)
    )
    .filter(Boolean); // filters out falsy values (null, undefined, false, 0, "")

  return (
    <section className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <section className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <article className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-semibold">
            Meals for {formatDate(date)}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </article>

        <section className="p-6">
          {allMeals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No meals planned for this day :(
            </p>
          ) : allMeals.length === 1 ? (
            <SingleMealView
              meal={allMeals[0]}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allMeals.map((meal) => (
                <div key={meal.id} className="space-y-2">
                  <h3 className="text-lg font-semibold capitalize">
                    {formatCategoryName(meal.category)}
                  </h3>
                  <DailyMealsView
                    recipe={meal}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </section>
  );
};

export default DailyMealsPopup;
