/*
 * RightClickMenu component is a context menu
 */

import { Trash2, Heart } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTranslation } from "react-i18next";

type Props = {
  children: React.ReactNode;
  onAddNewMeal: () => void;
  onAddExistingMeal: () => void;
  onDeleteMeals: () => void;
  date: Date;
};

const RightClickMenu: React.FC<Props> = ({
  children,
  onAddNewMeal,
  onAddExistingMeal,
  onDeleteMeals,
  date,
}) => {
  const { t } = useTranslation();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onAddExistingMeal}>
          <Heart className="mr-2 h-4 w-4" />
          {t("addExistingMeal")}
        </ContextMenuItem>
        <ContextMenuItem onClick={onDeleteMeals}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t("deleteMeals")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RightClickMenu;
