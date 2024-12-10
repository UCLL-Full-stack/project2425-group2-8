import { Recipe } from '../model/recipe';
import { RecipeIngredient } from '../model/recipeIngredient';
import { Ingredient } from '../model/ingredient';
import recipeDb from '../repository/recipe.db';
import { RecipeUpdateInput } from '../types';

const getAllRecipes = async (): Promise<Recipe[]> => {
    return await recipeDb.getAllRecipes();
};

const getRecipeById = async (id: number): Promise<Recipe> => {
    const recipe = await recipeDb.getRecipeById({ id });
    if (!recipe) throw new Error(`Recipe with id ${id} does not exist.`);
    return recipe;
};

const getIngredientsForRecipes = async (recipeIds: number[]): Promise<any[]> => {
    const ingredientsMap: Record<string, any> = {};

    for (const recipeId of recipeIds) {
        const recipe: Recipe | null = await recipeDb.getRecipeById({ id: recipeId });
        if (recipe) {
            const recipeIngredients: RecipeIngredient[] | undefined = recipe.getIngredients();
            if (recipeIngredients) {
                for (const recipeIngredient of recipeIngredients) {
                    const ingredient: Ingredient | undefined = recipeIngredient.getIngredient();
                    if (ingredient) {
                        const key: string = `${ingredient.getName()}-${ingredient.getCategory()}`;
                        if (ingredientsMap[key]) {
                            ingredientsMap[key].quantity += recipeIngredient.getQuantity();
                            ingredientsMap[key].recipes.push({
                                recipeId: recipe.getId(),
                                recipeTitle: recipe.getTitle(),
                                quantity: recipeIngredient.getQuantity(),
                            });
                        } else {
                            ingredientsMap[key] = {
                                ...ingredient,
                                quantity: recipeIngredient.getQuantity(),
                                recipes: [
                                    {
                                        recipeId: recipe.getId(),
                                        recipeTitle: recipe.getTitle(),
                                        quantity: recipeIngredient.getQuantity(),
                                    },
                                ],
                            };
                        }
                    }
                }
            }
        }
    }

    return Object.values(ingredientsMap);
};

const updateRecipe = async (
    id: number,
    recipeData: RecipeUpdateInput,
    userId: number
): Promise<Recipe> => {
    const recipe = await recipeDb.getRecipeById({ id });
    if (!recipe) throw new Error(`Recipe with id ${id} does not exist.`);

    if (recipeData.title !== undefined && recipeData.title.trim() === '') {
        throw new Error('Invalid title');
    }

    recipe.updateRecipe(recipeData);
    await recipeDb.saveRecipe(recipe, userId);
    return recipe;
};

const deleteRecipe = async (id: number): Promise<void> => {
    if (id <= 0) throw new Error('Invalid recipe ID');

    const recipe = await recipeDb.getRecipeById({ id });
    if (!recipe) throw new Error(`Recipe with id ${id} does not exist.`);
    await recipeDb.deleteRecipe({ id });
};

export default {
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getIngredientsForRecipes,
};
