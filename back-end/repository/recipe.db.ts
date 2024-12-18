import { RecipeCategory } from '@prisma/client';
import { Recipe } from '../model/recipe';
import database from './database';

const getAllRecipes = async (): Promise<Recipe[]> => {
    try {
        const recipesPrisma = await database.recipe.findMany({
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
        return recipesPrisma.map((recipePrisma) => Recipe.from(recipePrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const getRecipesByUserId = async (userId: number): Promise<Recipe[]> => {
    try {
        const recipesPrisma = await database.recipe.findMany({
            where: { userId: userId },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
        return recipesPrisma.map((recipePrisma) => Recipe.from(recipePrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const getRecipeById = async ({ id }: { id: number }): Promise<Recipe | null> => {
    try {
        const recipePrisma = await database.recipe.findUnique({
            where: { id },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                    },
                },
            },
        });
        return recipePrisma ? Recipe.from(recipePrisma) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const addRecipe = async (recipe: Recipe, userId: number): Promise<Recipe> => {
    try {
        const newRecipePrisma = await database.recipe.create({
            data: {
                title: recipe.getTitle(),
                instructions: recipe.getInstructions(),
                cookingTime: recipe.getCookingTime(),
                category: recipe.getCategory() as RecipeCategory,
                imageUrl: recipe.getImageUrl(),
                isFavorite: recipe.getIsFavorite(),
                notes: recipe.getNotes(),
                source: recipe.getSource(),
                scheduledDate: recipe.getScheduledDate() ?? null,
                ingredients: {
                    create: recipe.getIngredients()?.map((ingredient) => ({
                        ingredientId: ingredient.getIngredientId(),
                        unit: ingredient.getUnit(),
                        quantity: ingredient.getQuantity(),
                    })),
                },
                userId: userId,
            },
            include: {
                ingredients: true,
            },
        });
        return Recipe.from(newRecipePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const saveRecipe = async (recipe: Recipe, userId: number): Promise<Recipe> => {
    try {
        const existingRecipePrisma = await database.recipe.upsert({
            where: {
                id: recipe.getId(),
            },
            update: {
                title: recipe.getTitle(),
                instructions: recipe.getInstructions(),
                cookingTime: recipe.getCookingTime(),
                category: recipe.getCategory() as RecipeCategory,
                imageUrl: recipe.getImageUrl(),
                isFavorite: recipe.getIsFavorite(),
                notes: recipe.getNotes(),
                source: recipe.getSource(),
                scheduledDate: recipe.getScheduledDate() ?? null, // scheduledDate set to null if undefined
                ingredients: {
                    deleteMany: {},
                    create: recipe.getIngredients()?.map((ingredient) => ({
                        ingredientId: ingredient.getIngredientId(),
                        unit: ingredient.getUnit(),
                        quantity: ingredient.getQuantity(),
                    })),
                },
            },
            create: {
                title: recipe.getTitle(),
                instructions: recipe.getInstructions(),
                cookingTime: recipe.getCookingTime(),
                category: recipe.getCategory() as RecipeCategory,
                userId: userId,
                imageUrl: recipe.getImageUrl(),
                isFavorite: recipe.getIsFavorite(),
                notes: recipe.getNotes(),
                source: recipe.getSource(),
                scheduledDate: recipe.getScheduledDate() ?? null,
                ingredients: {
                    create: recipe.getIngredients()?.map((ingredient) => ({
                        ingredientId: ingredient.getIngredientId(),
                        unit: ingredient.getUnit(),
                        quantity: ingredient.getQuantity(),
                    })),
                },
            },
            include: {
                ingredients: true,
            },
        });
        return Recipe.from(existingRecipePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details');
    }
};

const deleteRecipe = async ({ id }: { id: number }): Promise<void> => {
    try {
        // delete relationship first
        await database.recipeIngredient.deleteMany({
            where: { recipeId: id },
        });

        // delete recipe
        await database.recipe.delete({
            where: { id },
        });
    } catch (error) {
        console.error(`Error deleting recipe with id ${id}:`, error);
        throw error;
    }
};

export default {
    getAllRecipes,
    addRecipe,
    saveRecipe,
    deleteRecipe,
    getRecipeById,
    getRecipesByUserId,
};
