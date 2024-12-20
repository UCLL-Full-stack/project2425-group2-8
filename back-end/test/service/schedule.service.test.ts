import scheduleService from '../../service/schedule.service';
import scheduleDb from '../../repository/schedule.db';
import recipeDb from '../../repository/recipe.db';
import { Recipe } from '../../model/recipe';
import { RecipeIngredient } from '../../model/recipeIngredient';
import { Ingredient } from '../../model/ingredient';
import { UnauthorizedError } from 'express-jwt';
import { Role, IngredientCategory } from '../../types';

jest.mock('../../repository/schedule.db');
jest.mock('../../repository/recipe.db');

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

const mockSchedule = {
    getId: jest.fn().mockReturnValue(1),
    getRecipes: jest.fn().mockReturnValue([mockRecipe]),
    addRecipe: jest.fn(),
    removeRecipe: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('given: valid userId and date, when: getScheduledRecipeDetails is called, then: it returns scheduled recipes', async () => {
    (scheduleDb.getScheduledRecipesByUserIdAndDate as jest.Mock).mockResolvedValue(mockSchedule);

    const recipes = await scheduleService.getScheduledRecipeDetails(1, new Date());

    expect(recipes).toEqual([mockRecipe]);
    expect(scheduleDb.getScheduledRecipesByUserIdAndDate).toHaveBeenCalledWith(1, expect.any(Date));
});

test('given: guest role, when: updateRecipeDate is called, then: it throws UnauthorizedError', async () => {
    await expect(
        scheduleService.updateRecipeDate(1, 1, new Date(), new Date(), 'guest' as Role)
    ).rejects.toThrow(UnauthorizedError);
});

test('given: valid details, when: updateRecipeDate is called, then: it updates the recipe date', async () => {
    (scheduleDb.getScheduledRecipesByUserIdAndDate as jest.Mock).mockResolvedValue(mockSchedule);
    (scheduleDb.createSchedule as jest.Mock).mockResolvedValue(mockSchedule);
    (scheduleDb.saveSchedule as jest.Mock).mockResolvedValue(undefined);

    const recipe = await scheduleService.updateRecipeDate(1, 1, new Date(), new Date(), 'user' as Role);

    expect(recipe).toEqual(mockRecipe);
    expect(scheduleDb.removeScheduledRecipe).toHaveBeenCalledWith(1, 1);
    expect(scheduleDb.saveSchedule).toHaveBeenCalledTimes(2);
});

test('given: guest role, when: deleteScheduledRecipe is called, then: it throws UnauthorizedError', async () => {
    await expect(
        scheduleService.deleteScheduledRecipe(1, 1, new Date(), 'guest' as Role)
    ).rejects.toThrow(UnauthorizedError);
});

test('given: valid details, when: deleteScheduledRecipe is called, then: it deletes the scheduled recipe', async () => {
    (scheduleDb.getScheduledRecipesByUserIdAndDate as jest.Mock).mockResolvedValue(mockSchedule);
    (recipeDb.saveRecipe as jest.Mock).mockResolvedValue(undefined);

    await scheduleService.deleteScheduledRecipe(1, 1, new Date(), 'user' as Role);

    expect(scheduleDb.removeScheduledRecipe).toHaveBeenCalledWith(1, 1);
    expect(recipeDb.saveRecipe).toHaveBeenCalled();
});

test('given: valid userId and date, when: copyMeals is called, then: it returns copied meals', async () => {
    (scheduleDb.getScheduledRecipesByUserIdAndDate as jest.Mock).mockResolvedValue(mockSchedule);

    const recipes = await scheduleService.copyMeals(1, new Date());

    expect(recipes).toEqual([mockRecipe]);
    expect(scheduleDb.getScheduledRecipesByUserIdAndDate).toHaveBeenCalledWith(1, new Date());
});

test('given: valid details, when: pasteMeals is called, then: it pastes the meals', async () => {
    (scheduleDb.getScheduledRecipesByUserIdAndDate as jest.Mock).mockResolvedValue(mockSchedule);
    (scheduleDb.createSchedule as jest.Mock).mockResolvedValue(mockSchedule);
    (scheduleDb.saveSchedule as jest.Mock).mockResolvedValue(undefined);

    const recipes = await scheduleService.pasteMeals(1, new Date(), new Date());

    expect(recipes).toEqual([mockRecipe]);
    expect(scheduleDb.saveSchedule).toHaveBeenCalled();
});

test('given: valid details, when: scheduleRecipe is called, then: it schedules the recipe', async () => {
    (recipeDb.getRecipeById as jest.Mock).mockResolvedValue(mockRecipe);
    (scheduleDb.getScheduledRecipesByUserIdAndDate as jest.Mock).mockResolvedValue(mockSchedule);
    (scheduleDb.saveSchedule as jest.Mock).mockResolvedValue(undefined);
    (recipeDb.saveRecipe as jest.Mock).mockResolvedValue(undefined);

    const recipe = await scheduleService.scheduleRecipe(1, 1, new Date());

    expect(recipe).toEqual(mockRecipe);
    expect(scheduleDb.saveSchedule).toHaveBeenCalled();
    expect(recipeDb.saveRecipe).toHaveBeenCalled();
});