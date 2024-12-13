import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddIngredientDialog from "./AddIngredientPopup";

type Props = {
  groupBy: "all" | "category";
  onGroupByChange: (value: "all" | "category") => void;
};

const ShoppingListHeader = ({ groupBy, onGroupByChange }: Props) => {
  return (
    <section className="p-4 border-b">
      <h2 className="text-xl font-semibold mb-4">Shopping List</h2>
      <section className="flex items-center gap-2">
        <AddIngredientDialog />
        <Select value={groupBy} onValueChange={onGroupByChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </section>
    </section>
  );
};

export default ShoppingListHeader;
