/* This is currently the homepage of the app, hence why the <Head /> and meta information */

import { useState } from "react";
import CalendarGrid from "@/components/planner/calendar/CalendarGrid";
import Greeting from "@/components/planner/Greeting";
import Head from "next/head";
import { Ingredient } from "@/types/recipes";
import ShoppingListSidebar from "@/components/planner/ShoppingListSidebar";

const MealPlanner: React.FC = () => {
  const [shoppingListIngredients, setShoppingListIngredients] = useState<
    Ingredient[]
  >([]);

  return (
    <>
      <Head>
        <title>Plateful</title>
        <meta
          name="description"
          content="Plateful - Your personal meal planning and shopping list app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content */}
      <main className="flex h-screen overflow-hidden">
        <section className="flex-1 overflow-auto">
          <section className="p-6">
            <Greeting />
            <h1 className="text-2xl font-bold mb-3">Meal Planner</h1>
            <CalendarGrid
              setShoppingListIngredients={setShoppingListIngredients}
            />
          </section>
        </section>

        {/* Shopping List Sidebar */}
        <section className="w-80 flex-shrink-0">
          <ShoppingListSidebar ingredients={shoppingListIngredients} />
        </section>
      </main>
    </>
  );
};

export default MealPlanner;
