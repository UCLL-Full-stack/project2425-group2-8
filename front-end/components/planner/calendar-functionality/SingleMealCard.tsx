/*
 * We decided to have 2 separate components for when there are more than one meal per day vs when there's only one meal.
 * SingleMealView component displays detailed information about a single meal.
 * It shows the meal's category, image, and provides options to toggle it as a favorite or delete it.
 */

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Trash2 } from "lucide-react";
import { Recipe } from "@/types/recipes";

type Props = {
  meal: Recipe & { notes?: string };
  onToggleFavorite: (mealId: number, isFavorite: boolean) => void;
  onDelete: (mealId: number) => void;
};

const SingleMealView: React.FC<Props> = ({
  meal,
  onToggleFavorite,
  onDelete,
}) => {
  return (
    <section className="max-w-2xl mx-auto">
      <article className="space-y-4">
        <h3 className="text-lg font-semibold capitalize mb-2">
          {meal.category}
        </h3>
        <Link href={`/recipes/${meal.id}`} className="block">
          {meal.imageUrl && (
            <div className="relative h-64 rounded-lg overflow-hidden my-2">
              <Image
                src={meal.imageUrl}
                alt={meal.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h4 className="text-2xl font-bold hover:underline">{meal.title}</h4>
        </Link>

        <article className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{meal.cookingTime} minutes</span>
        </article>
        {meal.notes && (
          <section>
            <h5 className="font-semibold">Notes</h5>
            <p className="text-gray-600">{meal.notes}</p>
          </section>
        )}

        <section className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onToggleFavorite(Number(meal.id), meal.isFavorite)}
            className="flex-1 hover:bg-gray-100"
          >
            <span className="flex items-center justify-center gap-2">
              <Heart
                className={`h-5 w-5 ${
                  meal.isFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-500"
                }`}
              />
              <span className="text-gray-700">
                {meal.isFavorite ? "Favorited" : "Favorite"}
              </span>
            </span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(Number(meal.id))}
            className="flex-1"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 className="h-5 w-4" />
              Delete
            </span>
          </Button>
        </section>
      </article>
    </section>
  );
};

export default SingleMealView;
