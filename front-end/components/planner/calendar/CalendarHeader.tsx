import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "next-i18next";

type Props = {
  currentDate: Date;
  selectionModeActive: boolean;
  selectedDatesCount: number;
  onChangeMonth: (value: number) => void;
  onToggleSelectionMode: () => void;
  onDeleteMeals: () => void;
  onAddToShoppingList: () => void;
  onToday: () => void;
  onAddNewMeal: () => void;
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]; // make type?

const CalendarHeader: React.FC<Props> = ({
  currentDate,
  selectionModeActive,
  selectedDatesCount,
  onChangeMonth,
  onToggleSelectionMode,
  onDeleteMeals,
  onToday,
  onAddNewMeal,
}) => {
  const { t } = useTranslation("common");

  return (
    <section className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onChangeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="m-0 text-lg font-semibold">
          {t(months[currentDate.getMonth()])} {currentDate.getFullYear()}
        </p>
        <Button variant="ghost" size="icon" onClick={() => onChangeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            onToday();
          }}
        >
          {t("today")}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={selectionModeActive ? "default" : "outline"}
          onClick={onToggleSelectionMode}
        >
          {selectionModeActive ? t("cancelSelection") : t("select")}
        </Button>
        <Button
          variant="outline"
          disabled={selectedDatesCount === 0}
          onClick={onDeleteMeals}
        >
          {t("deleteMeals")}
        </Button>
        <Button
          variant="outline"
          onClick={onAddNewMeal}
          className="bg-gray-900 text-white"
        >
          Create New Meal
        </Button>
      </div>
    </section>
  );
};

export default CalendarHeader;
