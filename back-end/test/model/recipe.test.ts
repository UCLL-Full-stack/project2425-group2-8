import { Recipe } from '../../model/recipe';
import { RecipeIngredient } from '../../model/recipeIngredient';
import { Ingredient } from '../../model/ingredient';
import { User } from '../../model/user';
import { Profile } from '../../model/profile';
import { IngredientCategory, RecipeCategory, Role } from '../../types';

const profile = new Profile({
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
});

const user = new User({
    id: 1,
    username: 'testuser',
    password: 'password',
    profile: profile,
    role: 'user' as Role,
});

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

const recipe = new Recipe({
    id: 1,
    title: 'Pancakes',
    instructions: 'Mix ingredients and cook.',
    cookingTime: 15,
    category: 'BREAKFAST' as RecipeCategory,
    ingredients: [recipeIngredient],
});

test('given: valid recipe details, when: recipe is created, then: recipe is created with those details', () => {
    expect(recipe.getId()).toBe(1);
    expect(recipe.getTitle()).toBe('Pancakes');
    expect(recipe.getInstructions()).toBe('Mix ingredients and cook.');
    expect(recipe.getCookingTime()).toBe(15);
    expect(recipe.getCategory()).toBe('BREAKFAST');
    expect(recipe.getIngredients()).toEqual([recipeIngredient]);
});

test('given: missing title, when: recipe is created, then: error is thrown', () => {
    expect(() => {
        new Recipe({
            id: 1,
            title: '',
            instructions: 'Mix ingredients and cook.',
            cookingTime: 15,
            category: 'BREAKFAST' as RecipeCategory,
            ingredients: [recipeIngredient],
        });
    }).toThrow('Title cannot be empty');
});

test('given: missing instructions, when: recipe is created, then: error is thrown', () => {
    expect(() => {
        new Recipe({
            id: 1,
            title: 'Pancakes',
            instructions: '',
            cookingTime: 15,
            category: 'BREAKFAST' as RecipeCategory,
            ingredients: [recipeIngredient],
        });
    }).toThrow('Instructions cannot be empty');
});

test('given: missing cooking time, when: recipe is created, then: error is thrown', () => {
    expect(() => {
        new Recipe({
            id: 1,
            title: 'Pancakes',
            instructions: 'Mix ingredients and cook.',
            cookingTime: 0,
            category: 'BREAKFAST' as RecipeCategory,
            ingredients: [recipeIngredient],
        });
    }).toThrow('Cooking time must be greater than zero');
});

test('given: missing category, when: recipe is created, then: error is thrown', () => {
    expect(() => {
        new Recipe({
            id: 1,
            title: 'Pancakes',
            instructions: 'Mix ingredients and cook.',
            cookingTime: 15,
            category: '' as RecipeCategory,
            ingredients: [recipeIngredient],
        });
    }).toThrow('Category cannot be empty');
});

test('given: missing ingredients, when: recipe is created, then: error is thrown', () => {
    expect(() => {
        new Recipe({
            id: 1,
            title: 'Pancakes',
            instructions: 'Mix ingredients and cook.',
            cookingTime: 15,
            category: 'BREAKFAST' as RecipeCategory,
            ingredients: [],
        });
    }).toThrow('Recipe must have at least one ingredient');
});

test('given: new title, when: title is set, then: title is updated', () => {
    const newTitle = 'Waffles';
    recipe.setTitle(newTitle);
    expect(recipe.getTitle()).toBe(newTitle);
});

test('given: new instructions, when: instructions are set, then: instructions are updated', () => {
    const newInstructions = 'Mix ingredients and cook on a waffle iron.';
    recipe.setInstructions(newInstructions);
    expect(recipe.getInstructions()).toBe(newInstructions);
});

test('given: new cooking time, when: cooking time is set, then: cooking time is updated', () => {
    const newCookingTime = 20;
    recipe.setCookingTime(newCookingTime);
    expect(recipe.getCookingTime()).toBe(newCookingTime);
});

test('given: new category, when: category is set, then: category is updated', () => {
    const newCategory = 'LUNCH' as RecipeCategory;
    recipe.setCategory(newCategory);
    expect(recipe.getCategory()).toBe(newCategory);
});

test('given: new ingredient, when: ingredient is added, then: ingredient is added to recipe', () => {
    const newIngredient = new RecipeIngredient({
        recipeId: 1,
        ingredientId: 2,
        ingredient: new Ingredient({
            id: 2,
            name: 'Sugar',
            category: 'PANTRY' as IngredientCategory,
        }),
        unit: 'cups',
        quantity: 1,
    });

    recipe.addIngredient(newIngredient);
    expect(recipe.getIngredients()).toContain(newIngredient);
});

test('given: existing ingredient, when: ingredient is removed, then: ingredient is removed from recipe', () => {
    recipe.removeIngredient(recipeIngredient.getIngredientId());
    expect(recipe.getIngredients()).not.toContain(recipeIngredient);
});

test('given: updated ingredient, when: ingredient is updated, then: ingredient is updated in recipe', () => {
    const updatedIngredient = new RecipeIngredient({
        recipeId: 1,
        ingredientId: ingredient.getId()!,
        ingredient: ingredient,
        unit: 'grams',
        quantity: 500,
    });

    recipe.addIngredient(updatedIngredient);
    recipe.updateIngredient(updatedIngredient);
    expect(recipe.getIngredients()).toContainEqual(updatedIngredient);
});

test('given: new image URL, when: image URL is set, then: image URL is updated', () => {
    const newImageUrl = 'http://example.com/image.jpg';
    recipe.setImageUrl(newImageUrl);
    expect(recipe.getImageUrl()).toBe(newImageUrl);
});

test('given: new favorite status, when: favorite status is set, then: favorite status is updated', () => {
    recipe.setIsFavorite(true);
    expect(recipe.getIsFavorite()).toBe(true);
});

test('given: new notes, when: notes are set, then: notes are updated', () => {
    const newNotes = 'These are some new notes.';
    recipe.setNotes(newNotes);
    expect(recipe.getNotes()).toBe(newNotes);
});

test('given: new source, when: source is set, then: source is updated', () => {
    const newSource = 'New Source';
    recipe.setSource(newSource);
    expect(recipe.getSource()).toBe(newSource);
});

test('given: new scheduled date, when: scheduled date is set, then: scheduled date is updated', () => {
    const newScheduledDate = new Date();
    recipe.setScheduledDate(newScheduledDate);
    expect(recipe.getScheduledDate()).toBe(newScheduledDate);
});