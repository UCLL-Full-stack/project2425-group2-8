import { Ingredient } from '../../model/ingredient';
import { IngredientCategory } from '../../types';

test('given: valid ingredient details, when: ingredient is created, then: ingredient is created with those details', () => {
    const ingredient = new Ingredient({
        id: 1,
        name: 'Flour',
        category: 'PANTRY' as IngredientCategory,
        store: 'Store A',
    });

    expect(ingredient.getId()).toBe(1);
    expect(ingredient.getName()).toBe('Flour');
    expect(ingredient.getCategory()).toBe('PANTRY');
    expect(ingredient.getStore()).toBe('Store A');
});

test('given: missing name, when: ingredient is created, then: error is thrown', () => {
    expect(() => {
        new Ingredient({
            id: 1,
            name: '',
            category: 'PANTRY' as IngredientCategory,
        });
    }).toThrow('Name is required');
});

test('given: invalid id, when: ingredient is created, then: error is thrown', () => {
    expect(() => {
        new Ingredient({
            id: -1,
            name: 'Flour',
            category: 'PANTRY' as IngredientCategory,
        });
    }).toThrow('Invalid id');
});

test('given: invalid store, when: ingredient is created, then: error is thrown', () => {
    expect(() => {
        new Ingredient({
            id: 1,
            name: 'Flour',
            category: 'PANTRY' as IngredientCategory,
            store: 123 as unknown as string,
        });
    }).toThrow('Store must be a string');
});

test('given: missing category, when: ingredient is created, then: error is thrown', () => {
    expect(() => {
        new Ingredient({
            id: 1,
            name: 'Flour',
            category: '' as IngredientCategory,
        });
    }).toThrow('Category is required');
});

test('given: two ingredients with same details, when: compared, then: they are equal', () => {
    const ingredient1 = new Ingredient({
        id: 1,
        name: 'Flour',
        category: 'PANTRY' as IngredientCategory,
        store: 'Store A',
    });

    const ingredient2 = new Ingredient({
        id: 1,
        name: 'Flour',
        category: 'PANTRY' as IngredientCategory,
        store: 'Store A',
    });

    expect(ingredient1.equals(ingredient2)).toBe(true);
});

test('given: two ingredients with different details, when: compared, then: they are not equal', () => {
    const ingredient1 = new Ingredient({
        id: 1,
        name: 'Flour',
        category: 'PANTRY' as IngredientCategory,
        store: 'Store A',
    });

    const ingredient2 = new Ingredient({
        id: 2,
        name: 'Sugar',
        category: 'PANTRY' as IngredientCategory,
        store: 'Store B',
    });

    expect(ingredient1.equals(ingredient2)).toBe(false);
});

test('given: ingredient details, when: toJSON is called, then: it returns the ingredient details as JSON', () => {
    const ingredient = new Ingredient({
        id: 1,
        name: 'Flour',
        category: 'PANTRY' as IngredientCategory,
        store: 'Store A',
    });

    expect(ingredient.toJSON()).toEqual({
        id: 1,
        name: 'Flour',
        category: 'PANTRY',
        store: 'Store A',
    });
});