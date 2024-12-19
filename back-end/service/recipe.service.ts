import { UnauthorizedError } from 'express-jwt';
import { Recipe } from '../model/recipe';
import { RecipeIngredient } from '../model/recipeIngredient';
import { Ingredient } from '../model/ingredient';
import recipeDb from '../repository/recipe.db';
import { RecipeUpdateInput, Role } from '../types';
import userDb from '../repository/user.db';

const getRecipesByUserId = async (userId: number): Promise<Recipe[]> => {
    return await recipeDb.getRecipesByUserId(userId);
};

const getRecipeById = async (id: number): Promise<Recipe> => {
    const recipe = await recipeDb.getRecipeById({ id });
    if (!recipe) throw new Error(`Recipe with id ${id} does not exist.`);

    return recipe;
};

const updateRecipe = async (
    id: number,
    recipeData: RecipeUpdateInput,
    userId: number,
    role: Role
): Promise<Recipe> => {
    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'Guests cannot update recipes.',
        });
    }

    const recipe = await recipeDb.getRecipeById({ id });
    if (!recipe) throw new Error(`Recipe with id ${id} does not exist.`);

    const user = await userDb.getUserById({ id: userId });
    if (!user) throw new Error(`User with id ${userId} does not exist.`);

    if (!user.hasRecipe(id)) {
        throw new UnauthorizedError('credentials_required', {
            message: 'You do not have permission to update this recipe.',
        });
    }

    recipe.updateRecipe(recipeData);
    await recipeDb.saveRecipe(recipe, userId);
    return recipe;
};

const deleteRecipe = async (id: number, userId: number, role: Role): Promise<void> => {
    if (role === 'guest') {
        throw new UnauthorizedError('credentials_required', {
            message: 'Guests cannot delete recipes.',
        });
    }

    if (id <= 0) throw new Error('Invalid recipe ID');

    const recipe = await recipeDb.getRecipeById({ id });
    if (!recipe) throw new Error(`Recipe with id ${id} does not exist.`);

    const user = await userDb.getUserById({ id: userId });
    if (!user) throw new Error(`User with id ${userId} does not exist.`);

    if (!user.hasRecipe(id)) {
        throw new UnauthorizedError('credentials_required', {
            message: 'You do not have permission to delete this recipe.',
        });
    }

    await recipeDb.deleteRecipe({ id });
};
export default { getRecipesByUserId, getRecipeById, updateRecipe, deleteRecipe };
