import recipeService from '../../service/recipe.service';
import recipeDb from '../../repository/recipe.db';
import userDb from '../../repository/user.db';
import { Recipe } from '../../model/recipe';
import { RecipeIngredient } from '../../model/recipeIngredient';
import { Ingredient } from '../../model/ingredient';
import { UnauthorizedError } from 'express-jwt';
import { RecipeUpdateInput, Role, NewRecipeInput, IngredientCategory, RecipeCategory } from '../../types';

jest.mock('../../repository/recipe.db');
jest.mock('../../repository/user.db');

const ingredient = new Ingredient({
    id: 1,
    name: 'Flour',
    category: 'PANTRY' as IngredientCategory,
});

const recipeIngredient = new RecipeIngredient({
    recipeId: 1,
    ingredientId: ingredient.getId()!,
    ingredient: ingredient,
    unit: 'cups',
    quantity: 2,
});

const mockRecipe = new Recipe({
    id: 1,
    title: 'Pancakes',
    instructions: 'Mix ingredients and cook.',
    cookingTime: 15,
    category: 'BREAKFAST',
    ingredients: [recipeIngredient],
});

const mockUser = {
    getId: jest.fn().mockReturnValue(1),
    hasRecipe: jest.fn().mockReturnValue(true),
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('given: valid userId, when: getRecipesByUserId is called, then: it returns recipes', async () => {
    (recipeDb.getRecipesByUserId as jest.Mock).mockResolvedValue([mockRecipe]);

    const recipes = await recipeService.getRecipesByUserId(1);

    expect(recipes).toEqual([mockRecipe]);
    expect(recipeDb.getRecipesByUserId).toHaveBeenCalledWith(1);
});

test('given: valid recipe id, when: getRecipeById is called, then: it returns the recipe', async () => {
    (recipeDb.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);

    const recipe = await recipeService.getRecipeById(1);

    expect(recipe).toEqual(mockRecipe);
    expect(recipeDb.getRecipeById).toHaveBeenCalledWith({ id: 1 });
});

test('given: guest role, when: updateRecipe is called, then: it throws UnauthorizedError', async () => {
    const recipeData: RecipeUpdateInput = {
        title: 'New Title',
        instructions: 'Updated instructions',
        cookingTime: 20,
        category: 'BREAKFAST',
        ingredients: [
            {
                ingredient: ingredient,
                unit: 'cups',
                quantity: 2,
            },
        ],
    };

    await expect(
        recipeService.updateRecipe(1, recipeData, 1, 'guest' as Role)
    ).rejects.toThrow(UnauthorizedError);
});

test('given: valid details, when: updateRecipe is called, then: it updates the recipe', async () => {
    const recipeData: RecipeUpdateInput = {
        title: 'New Title',
        instructions: 'Updated instructions',
        cookingTime: 20,
        category: 'BREAKFAST',
        ingredients: [
            {
                ingredient: ingredient,
                unit: 'cups',
                quantity: 2,
            },
        ],
    };

    (recipeDb.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
    (userDb.getUserById as jest.Mock).mockResolvedValue(mockUser);
    (recipeDb.saveRecipe as jest.Mock).mockResolvedValue(undefined);

    const recipe = await recipeService.updateRecipe(1, recipeData, 1, 'user' as Role);

    expect(recipe).toEqual(mockRecipe);
    expect(recipeDb.saveRecipe).toHaveBeenCalled();
});

test('given: guest role, when: deleteRecipe is called, then: it throws UnauthorizedError', async () => {
    await expect(recipeService.deleteRecipe(1, 1, 'guest' as Role)).rejects.toThrow(UnauthorizedError);
});

test('given: valid details, when: deleteRecipe is called, then: it deletes the recipe', async () => {
    (recipeDb.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
    (userDb.getUserById as jest.Mock).mockResolvedValue(mockUser);

    await recipeService.deleteRecipe(1, 1, 'user' as Role);

    expect(recipeDb.deleteRecipe).toHaveBeenCalledWith({ id: 1 });
});

test('given: valid userId, when: getFavoriteRecipesByUserId is called, then: it returns favorite recipes', async () => {
    const favoriteRecipe = new Recipe({
        id: mockRecipe.getId(),
        title: mockRecipe.getTitle(),
        instructions: mockRecipe.getInstructions(),
        cookingTime: mockRecipe.getCookingTime(),
        category: mockRecipe.getCategory() as RecipeCategory,
        ingredients: mockRecipe.getIngredients() || [],
        isFavorite: true,
    });

    (recipeDb.getRecipesByUserId as jest.Mock).mockResolvedValue([favoriteRecipe]);

    const recipes = await recipeService.getFavoriteRecipesByUserId(1);

    expect(recipes).toEqual([favoriteRecipe]);
    expect(recipeDb.getRecipesByUserId).toHaveBeenCalledWith(1);
});

test('given: valid recipe data, when: createRecipe is called, then: it creates a new recipe', async () => {
    const recipeData: NewRecipeInput = {
        title: 'New Recipe',
        instructions: 'Mix ingredients and cook.',
        cookingTime: 20,
        category: 'BREAKFAST',
        ingredients: [
            {
                id: 1,
                name: 'Flour',
                category: 'PANTRY' as IngredientCategory,
                unit: 'cups',
                quantity: 2,
            },
        ],
    };

    const newRecipe = new Recipe({
        id: 2,
        title: 'New Recipe',
        instructions: 'Mix ingredients and cook.',
        cookingTime: 20,
        category: 'BREAKFAST',
        ingredients: [recipeIngredient],
    });

    (recipeDb.addRecipe as jest.Mock).mockResolvedValue(newRecipe);

    const recipe = await recipeService.createRecipe(recipeData, 1);

    expect(recipe).toEqual(newRecipe);
    expect(recipeDb.addRecipe).toHaveBeenCalled();
});