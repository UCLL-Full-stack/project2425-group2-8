import {
    Recipe as RecipePrisma,
    Ingredient as IngredientPrisma,
    RecipeIngredient as RecipeIngredientPrisma,
} from '@prisma/client';
import { Ingredient } from './ingredient';

export class RecipeIngredient {
    private recipeId: number;
    private ingredient?: Ingredient;
    private ingredientId: number;
    private unit: string;
    private quantity: number;

    constructor(recipeIngredient: {
        recipeId: number;
        ingredientId: number;
        unit: string;
        quantity: number;
        ingredient?: Ingredient;
    }) {
        this.recipeId = recipeIngredient.recipeId;
        this.ingredientId = recipeIngredient.ingredientId;
        this.unit = recipeIngredient.unit;
        this.quantity = recipeIngredient.quantity;
        this.ingredient = recipeIngredient.ingredient;
    }

    static from({
        recipeId,
        ingredientId,
        unit,
        quantity,
        ingredient,
    }: RecipeIngredientPrisma & { ingredient?: IngredientPrisma }): RecipeIngredient {
        const recipeIngredient = new RecipeIngredient({
            recipeId,
            ingredientId,
            unit,
            quantity,
        });
        if (ingredient) {
            recipeIngredient.ingredient = Ingredient.from(ingredient); // Assume an `Ingredient.from` method exists
        }
        return recipeIngredient;
    }

    getIngredient(): Ingredient | undefined {
        return this.ingredient;
    }

    getRecipeId(): number {
        return this.recipeId;
    }

    getIngredientId(): number {
        return this.ingredientId;
    }

    getUnit(): string {
        return this.unit;
    }

    setUnit(unit: string) {
        this.unit = unit;
    }

    getQuantity(): number {
        return this.quantity;
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    }

    toJSON() {
        return {
            recipeId: this.recipeId,
            ingredientId: this.ingredientId,
            unit: this.unit,
            quantity: this.quantity,
            ingredient: this.ingredient?.toJSON(),
        };
    }

    equals(recipeIngredient: RecipeIngredient): boolean {
        return (
            this.recipeId === recipeIngredient.getRecipeId() &&
            this.ingredientId === recipeIngredient.getIngredientId() &&
            this.unit === recipeIngredient.getUnit() &&
            this.quantity === recipeIngredient.getQuantity()
        );
    }
}
