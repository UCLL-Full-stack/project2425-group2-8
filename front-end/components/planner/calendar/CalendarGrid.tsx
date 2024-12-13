/**
 * CalendarGrid component displays a grid of days for the current month (or week --> to implement)
 * It manages the state for the current date, view mode, selected dates, and other interactions.
 */

// QUESTION: Is this component correct? Or the fetch logic should be in the planner index.tsx page?
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PlannerService from "@/services/PlannerService";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import DailyMealsPopup from "../calendar-functionality/DailyMealsPopup";
import { Ingredient, Recipe } from "@/types/recipes";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // make a type?

type Props = {
  setShoppingListIngredients: (ingredients: Ingredient[]) => void;
};

const CalendarGrid: React.FC<Props> = ({ setShoppingListIngredients }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"Month" | "Week">("Month"); // to implement
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectionModeActive, setSelectionModeActive] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showRecipePopup, setShowRecipePopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [recipesByDate, setRecipesByDate] = useState<Record<string, Recipe[]>>(
    {}
  );

  // To fix issues with dates
  const toUTCDate = (date: Date) => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };
  const formatDateUTC = (date: Date) => {
    return toUTCDate(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchMonthRecipes = async () => {
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const recipesByDateTemp: Record<string, Recipe[]> = {};

      for (
        let i = new Date(startDate);
        i <= endDate;
        i.setDate(i.getDate() + 1)
      ) {
        const dateString = formatDateUTC(i);
        try {
          const recipes = await PlannerService.fetchMealDetails(1, dateString); // userId is 1 for testing -- temporary
          if (recipes.length > 0) {
            recipesByDateTemp[dateString] = recipes;
          }
        } catch (error) {
          console.error("Error fetching recipes for", dateString, error);
        }
      }

      setRecipesByDate(recipesByDateTemp);
    };

    fetchMonthRecipes();
  }, [currentDate]); // re-run whenever currentDate changes

  // calculate days that should be displayed in the calendar for 1 full grid
  const getDaysInGrid = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInGrid = [];

    const daysToAddAtStart = (firstDay.getDay() + 6) % 7; // shifts Monday to 0 and Sunday to 6 first
    const daysToAddAtEnd = (7 - lastDay.getDay()) % 7; // days to complete the week

    // add days from previous month
    for (let i = daysToAddAtStart; i > 0; i--) {
      const day = new Date(year, month, 1 - i);
      daysInGrid.push(day);
    }

    // add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      daysInGrid.push(day);
    }

    // add days from next month
    for (let i = 1; i <= daysToAddAtEnd; i++) {
      const day = new Date(year, month + 1, i);
      daysInGrid.push(day);
    }

    return daysInGrid;
  };

  const changeMonth = (value: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + value);
    setCurrentDate(newDate);
  };

  const handleDateClick = (newDate: Date) => {
    if (selectionModeActive) {
      setSelectedDates((prevDates) => {
        const isSelected = prevDates.some(
          (d) => d.getTime() === newDate.getTime()
        );
        if (isSelected) {
          return prevDates.filter((d) => d.getTime() !== newDate.getTime());
        } else {
          return [...prevDates, newDate];
        }
      });
    } else {
      setSelectedDate(newDate);
      setShowRecipePopup(true);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionModeActive((prevMode) => !prevMode);
    if (selectionModeActive) {
      setSelectedDates([]);
    }
  };

  const handleAddToShoppingList = async () => {
    if (selectedDates.length === 0) {
      return;
    }

    const recipeIds = selectedDates.flatMap(
      (date) =>
        recipesByDate[formatDateUTC(date)]?.map((recipe) => recipe.id) || []
    );
    if (recipeIds.length === 0) {
      return;
    }

    try {
      const ingredients = await PlannerService.fetchIngredientsForRecipes(
        recipeIds
      );

      // send ingredients to the shopping list sidebar component
      setShoppingListIngredients(ingredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleDeleteMeals = () => {
    // to implement!
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          selectionModeActive={selectionModeActive}
          selectedDatesCount={selectedDates.length}
          onChangeMonth={changeMonth}
          onToggleSelectionMode={toggleSelectionMode}
          onChangeViewMode={setViewMode}
          onDeleteMeals={handleDeleteMeals}
          onAddToShoppingList={handleAddToShoppingList}
          onToday={handleGoToToday}
        />

        <section className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold p-2">
              {day}
            </div>
          ))}

          {getDaysInGrid(currentDate).map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              currentMonth={currentDate.getMonth()}
              isSelected={selectedDates.some(
                (d) => d.getTime() === date.getTime()
              )}
              isHovered={hoveredDate?.getTime() === date.getTime()}
              selectionModeActive={selectionModeActive}
              recipes={recipesByDate[formatDateUTC(date)] || []}
              onDateClick={handleDateClick}
              onCheckboxChange={(checked, date) => {
                if (checked) {
                  setSelectedDates((prev) => [...prev, date]);
                } else {
                  setSelectedDates((prev) =>
                    prev.filter((d) => d.getTime() !== date.getTime())
                  );
                }
              }}
              onMouseEnter={setHoveredDate}
              onMouseLeave={() => setHoveredDate(null)}
            />
          ))}
        </section>
      </CardContent>
      {showRecipePopup && selectedDate && (
        <DailyMealsPopup
          userId={1}
          date={selectedDate}
          onClose={() => setShowRecipePopup(false)}
        />
      )}
    </Card>
  );
};

export default CalendarGrid;
