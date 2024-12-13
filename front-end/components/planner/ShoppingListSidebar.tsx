/*
 * This component displays a shopping list sidebar where users can view, add, edit, and remove ingredients
 * Ingredients can be grouped by category or viewed all together in alphabetical order
 */

import { Ingredient } from "@/types/recipes";
import { useEffect, useState } from "react";
import ShoppingListHeader from "./shopping-list/ShoppingListHeader";
import { Card, CardContent } from "../ui/card";
import IngredientItem from "./shopping-list/IngredientItem";

type Props = {
  ingredients: Ingredient[];
};

const ShoppingListSidebar = ({ ingredients }: Props) => {
  const [localIngredients, setLocalIngredients] =
    useState<Ingredient[]>(ingredients);
  const [groupBy, setGroupBy] = useState<"all" | "category">("category");
  const [expandedIngredient, setExpandedIngredient] = useState<number | null>(
    null
  );
  const [editingIngredientId, setEditingIngredientId] = useState<number | null>(
    null
  );

  useEffect(() => {
    setLocalIngredients(ingredients);
  }, [ingredients]);

  const handleToggleExpand = (ingredientId: number) => {
    setExpandedIngredient(
      expandedIngredient === ingredientId ? null : ingredientId
    );
  };

  const handleQuantityChange = (id: number, change: number) => {
    setLocalIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              quantity: Math.max(0, ingredient.quantity + change),
            }
          : ingredient
      )
    );
  };

  const handleQuantityEdit = (id: number, newQuantity: string) => {
    setLocalIngredients((prevIngredients) =>
      prevIngredients.map((ing) =>
        ing.id === id
          ? { ...ing, quantity: Math.max(0, parseInt(newQuantity) || 0) }
          : ing
      )
    );
  };

  const handleDeleteIngredient = (id: number) => {
    setLocalIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const handleToggleCheck = (id: number) => {
    setLocalIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, checked: !ingredient.checked }
          : ingredient
      )
    );
  };

  // Group ingredients by their categories
  const groupedIngredients = localIngredients.reduce<
    Record<string, Ingredient[]>
  >((acc, ingredient) => {
    const category = ingredient.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ingredient);
    return acc;
  }, {});

  return (
    <aside className="h-screen border-l bg-white">
      <div className="flex flex-col h-full">
        <ShoppingListHeader groupBy={groupBy} onGroupByChange={setGroupBy} />

        <section className="flex-1 overflow-auto p-4">
          <section className="space-y-4">
            {groupBy === "all" ? (
              <Card>
                <CardContent className="p-4">
                  <section className="space-y-2">
                    {localIngredients.map((ingredient) => (
                      <IngredientItem
                        key={ingredient.id}
                        ingredient={ingredient}
                        expandedId={expandedIngredient}
                        editingId={editingIngredientId}
                        onToggleExpand={handleToggleExpand}
                        onToggleCheck={handleToggleCheck}
                        onQuantityChange={handleQuantityChange}
                        onQuantityEdit={handleQuantityEdit}
                        onDelete={handleDeleteIngredient}
                        setEditingId={setEditingIngredientId}
                        shoppingListIngredients={localIngredients}
                      />
                    ))}
                  </section>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedIngredients).map(
                ([category, categoryIngredients]) => (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <article className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {category} ({categoryIngredients.length})
                        </h3>
                      </article>
                      <section className="space-y-2">
                        {categoryIngredients.map((ingredient) => (
                          <IngredientItem
                            key={ingredient.id}
                            ingredient={ingredient}
                            expandedId={expandedIngredient}
                            editingId={editingIngredientId}
                            onToggleExpand={handleToggleExpand}
                            onToggleCheck={handleToggleCheck}
                            onQuantityChange={handleQuantityChange}
                            onQuantityEdit={handleQuantityEdit}
                            onDelete={handleDeleteIngredient}
                            setEditingId={setEditingIngredientId}
                            shoppingListIngredients={localIngredients}
                          />
                        ))}
                      </section>
                    </CardContent>
                  </Card>
                )
              )
            )}
          </section>
        </section>
      </div>
    </aside>
  );
};

export default ShoppingListSidebar;
