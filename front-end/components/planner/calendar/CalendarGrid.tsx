import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PlannerService from "@/services/PlannerService";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import DailyMealsPopup from "../calendar-functionality/DailyMealsPopup";
import { Recipe } from "@/types/recipes";
import { useTranslation } from "next-i18next";
import AddNewMealPopup from "../calendar-functionality/AddNewMealPopup";

const CalendarGrid: React.FC = () => {
  const { t } = useTranslation("common");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectionModeActive, setSelectionModeActive] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showRecipePopup, setShowRecipePopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddNewMealOpen, setIsAddNewMealOpen] = useState(false);
  const [recipesByDate, setRecipesByDate] = useState<Record<string, Recipe[]>>(
    {}
  );
  const [isGuest, setIsGuest] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "guest") {
      setIsGuest(true);
    }
  }, []);

  const handleAddNewMeal = () => {
    setIsAddNewMealOpen(true);
  };

  const handleSaveNewMeal = async (recipe: Omit<Recipe, "id">) => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      try {
        const dateString = formatDateUTC(currentDate);
        await PlannerService.saveNewMeal(recipe, dateString, userToken);
        await fetchMonthRecipes();
        setIsAddNewMealOpen(false);
      } catch (error) {
        console.error("Error saving new meal:", error);
      }
    } else {
      console.error("No token found in local storage");
    }
  };

  // To fix issues with dates
  const toUTCDate = (date: Date) => {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };
  const formatDateUTC = (date: Date) => {
    return toUTCDate(date).toISOString().split("T")[0];
  };

  const fetchMonthRecipes = useCallback(async () => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      try {
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

        const newRecipesByDate: Record<string, Recipe[]> = {};

        for (
          let date = new Date(startDate);
          date <= endDate;
          date.setDate(date.getDate() + 1)
        ) {
          const dateString = formatDateUTC(date);
          try {
            const recipes = await PlannerService.fetchMealDetails(
              dateString,
              userToken
            );
            if (recipes.length > 0) {
              newRecipesByDate[dateString] = recipes;
            }
          } catch (error) {
            console.error(t("errorFetchingMeals"), dateString, error);
          }
        }

        setRecipesByDate(newRecipesByDate);
      } catch (error) {
        console.error(t("errorFetchingMonthRecipes"), error);
      }
    } else {
      console.error(t("noTokenFound"));
    }
  }, [currentDate, t]);

  useEffect(() => {
    fetchMonthRecipes();
  }, [fetchMonthRecipes, currentDate]);

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

  const handleAddToShoppingList = () => {
    if (selectedDates.length === 0) {
      return;
    }
    // to implement!
  };

  const handleDeleteMeals = async () => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      try {
        const updatedRecipesByDate = { ...recipesByDate };
        for (const date of selectedDates) {
          const dateString = formatDateUTC(date);
          const recipes = recipesByDate[dateString] || [];
          for (const recipe of recipes) {
            if (recipe.id !== undefined) {
              await PlannerService.deleteMeal(recipe.id, dateString, userToken);
            }
          }
          delete updatedRecipesByDate[dateString]; // remove date from the state
        }
        setRecipesByDate(updatedRecipesByDate); // update the state
        setSelectedDates([]);
        fetchMonthRecipes(); // refresh calendar after deletion
      } catch (error) {
        console.error("Error deleting meals:", error);
      }
    } else {
      console.error("No token found in local storage");
    }
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 w-full">
        <CalendarHeader
          currentDate={currentDate}
          selectionModeActive={selectionModeActive}
          selectedDatesCount={selectedDates.length}
          onChangeMonth={changeMonth}
          onToggleSelectionMode={toggleSelectionMode}
          onDeleteMeals={handleDeleteMeals}
          onAddToShoppingList={handleAddToShoppingList}
          onToday={handleGoToToday}
          onAddNewMeal={handleAddNewMeal}
        />

        <section className="grid grid-cols-7 gap-2 w-full">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-semibold p-2">
              {t(day)}
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
              recipesByDate={recipesByDate}
              fetchMonthRecipes={fetchMonthRecipes}
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
      <AddNewMealPopup
        isOpen={isAddNewMealOpen}
        onClose={() => setIsAddNewMealOpen(false)}
        onSave={handleSaveNewMeal}
        date={currentDate}
      />
    </Card>
  );
};

export default CalendarGrid;
