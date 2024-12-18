import CalendarGrid from "@/components/planner/calendar/CalendarGrid";
import Greeting from "@/components/planner/Greeting";
import ShoppingList from "@/components/planner/ShoppingListSidebar";
import { useEffect, useState } from "react";

const MealPlanner: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("loggedInUser");
    if (userToken) {
      try {
        const user = JSON.parse(userToken);
        if (user.token) {
          setUser({ name: user.username });
        }
      } catch (e) {
        console.error("Failed to parse LoggedInUser:", e);
      }
    }
  }, []);

  return (
    <>
      {/* Main Content */}
      <main className="flex h-screen overflow-hidden">
        <section className="flex-1 overflow-auto">
          <section className="p-6">
            <Greeting user={user} />
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
