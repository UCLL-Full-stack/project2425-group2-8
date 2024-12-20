import { User } from '../../model/user';
import { Profile } from '../../model/profile';
import { Recipe } from '../../model/recipe';
import { Schedule } from '../../model/schedule';
import { Ingredient } from '../../model/ingredient';
import { RecipeIngredient } from '../../model/recipeIngredient';
import { IngredientCategory, Role, RecipeCategory } from '../../types'; 

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

const schedule = new Schedule({
    id: 1,
    date: new Date(),
    recipes: [recipe],
});

test('given: valid user details, when: user is created, then: user is created with those details', () => {
    expect(user.getId()).toBe(1);
    expect(user.getUsername()).toBe('testuser');
    expect(user.getPassword()).toBe('password');
    expect(user.getProfile()).toBe(profile);
    expect(user.getRecipes()).toEqual([]);
    expect(user.getSchedule()).toBeNull();
});

test('given: missing username, when: user is created, then: error is thrown', () => {
    expect(() => {
        new User({
            id: 1,
            username: '',
            password: 'password',
            profile: profile,
            role: 'user' as Role,
        });
    }).toThrow('Username is required and cannot be empty');
});

test('given: missing password, when: user is created, then: error is thrown', () => {
    expect(() => {
        new User({
            id: 1,
            username: 'testuser',
            password: '',
            profile: profile,
            role: 'user' as Role,
        });
    }).toThrow('Password is required and cannot be empty');
});

test('given: missing role, when: user is created, then: error is thrown', () => {
    expect(() => {
        new User({
            id: 1,
            username: 'testuser',
            password: 'password',
            profile: profile,
            role: undefined as unknown as Role, // Simulate missing role
        });
    }).toThrow('Role is required');
});

test('given: a recipe, when: recipe is added to user, then: user has the recipe', () => {
    user.addRecipe(recipe);
    expect(user.getRecipes()).toContain(recipe);
});

test('given: a schedule, when: schedule is set for user, then: user has the schedule', () => {
    user.setSchedule(schedule);
    expect(user.getSchedule()).toBe(schedule);
});

test('given: two users with same details, when: compared, then: they are equal', () => {
    const anotherUser = new User({
        id: 2,
        username: 'testuser',
        password: 'password',
        profile: profile,
        role: 'user' as Role,
    });

    expect(user.equals(anotherUser)).toBe(true);
});

test('given: two users with different details, when: compared, then: they are not equal', () => {
    const anotherUser = new User({
        id: 2,
        username: 'differentuser',
        password: 'differentpassword',
        profile: profile,
        role: 'user' as Role,
    });

    expect(user.equals(anotherUser)).toBe(false);
});