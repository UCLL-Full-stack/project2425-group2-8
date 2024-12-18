import { RecipeCategory, RecipeUpdateInput } from '../types';
import { RecipeIngredient } from './recipeIngredient';

import {
    Recipe as RecipePrisma,
    RecipeCategory as CategoryPrisma,
    RecipeIngredient as RecipeIngredientPrisma,
    Ingredient as IngredientPrisma,
} from '@prisma/client';

export class Recipe {
    private id?: number;
    private title: string;
    private instructions: string;
    private cookingTime: number;
    private category: RecipeCategory;
    private ingredients: RecipeIngredient[];
    private imageUrl?: string;
    private isFavorite?: boolean;
    private notes?: string;
    private source?: string;
    private scheduledDate?: Date; // Add validations?

    constructor(recipe: {
        id?: number;
        title: string;
        instructions: string;
        cookingTime: number;
        category: RecipeCategory;
        ingredients: RecipeIngredient[];
        imageUrl?: string;
        isFavorite?: boolean;
        notes?: string;
        source?: string;
        scheduledDate?: Date;
    }) {
        this.validate(recipe);
        this.id = recipe.id;
        this.title = recipe.title;
        this.instructions = recipe.instructions;
        this.cookingTime = recipe.cookingTime;
        this.category = recipe.category;
        this.ingredients = recipe.ingredients;
        this.imageUrl = recipe.imageUrl;
        this.isFavorite = recipe.isFavorite;
        this.notes = recipe.notes;
        this.source = recipe.source;
        this.scheduledDate = recipe.scheduledDate;
    }

    static from({
        id,
        title,
        instructions,
        cookingTime,
        category,
        ingredients,
        imageUrl,
        isFavorite,
        notes,
        source,
        scheduledDate,
    }: RecipePrisma & {
        ingredients: (RecipeIngredientPrisma & { ingredient?: IngredientPrisma })[];
    }): Recipe {
        return new Recipe({
            id,
            title,
            instructions,
            cookingTime,
            category: category as RecipeCategory,
            ingredients: ingredients.map((ingredient) => RecipeIngredient.from(ingredient)),
            imageUrl: imageUrl || undefined,
            isFavorite: isFavorite || undefined,
            notes: notes || undefined,
            source: source || undefined,
            scheduledDate: scheduledDate || undefined,
        });
    }

    private validateId(id?: number): void {
        if (id !== undefined && id <= 0) {
            throw new Error('ID must be a positive number');
        }
    }

    private validateTitle(title: string): void {
        if (title.trim().length === 0) {
            throw new Error('Title cannot be empty');
        }
        if (title.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }
    }

    private validateInstructions(instructions: string): void {
        if (instructions.trim().length === 0) {
            throw new Error('Instructions cannot be empty');
        }
    }

    private validateCookingTime(cookingTime: number): void {
        if (cookingTime <= 0) {
            throw new Error('Cooking time must be greater than zero');
        }
    }

    private validateCategory(category: string): void {
        if (category.trim().length === 0) {
            throw new Error('Category cannot be empty');
        }
    }

    private validateIngredients(ingredients: RecipeIngredient[]): void {
        if (!ingredients || ingredients.length === 0) {
            throw new Error('Recipe must have at least one ingredient');
        }
    }

    private validateImageUrl(imageUrl?: string): void {
        if (imageUrl !== undefined && !this.isValidUrl(imageUrl)) {
            throw new Error('Invalid image URL');
        }
    }

    private validateIsFavorite(isFavorite?: boolean): void {
        if (isFavorite !== undefined && typeof isFavorite !== 'boolean') {
            throw new Error('isFavorite must be a boolean');
        }
    }

    private validateNotes(notes?: string): void {
        if (notes !== undefined && typeof notes !== 'string') {
            throw new Error('Notes must be a string');
        }
    }

    private validateSource(source?: string): void {
        if (source !== undefined && typeof source !== 'string') {
            throw new Error('Source must be a string');
        }
    }

    validate(recipe: {
        id?: number;
        title: string;
        instructions: string;
        cookingTime: number;
        category: string;
        ingredients: RecipeIngredient[];
        imageUrl?: string;
        isFavorite?: boolean;
        notes?: string;
        source?: string;
    }): void {
        this.validateId(recipe.id);
        this.validateTitle(recipe.title);
        this.validateInstructions(recipe.instructions);
        this.validateCookingTime(recipe.cookingTime);
        this.validateCategory(recipe.category);
        this.validateIngredients(recipe.ingredients);
        this.validateImageUrl(recipe.imageUrl);
        this.validateIsFavorite(recipe.isFavorite);
        this.validateNotes(recipe.notes);
        this.validateSource(recipe.source);
    }

    getId(): number | undefined {
        return this.id;
    }

    setId(id?: number) {
        this.validateId(id);
        this.id = id;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string) {
        this.validateTitle(title);
        this.title = title.trim();
    }

    getInstructions(): string {
        return this.instructions;
    }

    setInstructions(instructions: string) {
        this.validateInstructions(instructions);
        this.instructions = instructions.trim();
    }

    getCookingTime(): number {
        return this.cookingTime;
    }

    setCookingTime(cookingTime: number) {
        this.validateCookingTime(cookingTime);
        this.cookingTime = cookingTime;
    }

    getCategory(): string {
        return this.category;
    }

    setCategory(category: RecipeCategory) {
        this.validateCategory(category);
        this.category = category;
    }

    getIngredients(): RecipeIngredient[] | undefined {
        return this.ingredients;
    }

    setIngredients(ingredients: RecipeIngredient[]) {
        this.validateIngredients(ingredients);
        this.ingredients = ingredients;
    }

    addIngredient(ingredient: RecipeIngredient) {
        this.ingredients.push(ingredient);
    }

    removeIngredient(ingredientId: number) {
        this.ingredients = this.ingredients.filter(
            (ingredient) => ingredient.getIngredientId() !== ingredientId
        );
    }

    updateIngredient(updatedIngredient: RecipeIngredient) {
        const index = this.ingredients.findIndex(
            (ingredient) => ingredient.getIngredientId() === updatedIngredient.getIngredientId()
        );
        if (index !== -1) {
            this.ingredients[index] = updatedIngredient;
        }
    }

    getImageUrl(): string | undefined {
        return this.imageUrl;
    }

    setImageUrl(imageUrl?: string) {
        this.validateImageUrl(imageUrl);
        this.imageUrl = imageUrl;
    }

    getIsFavorite(): boolean | undefined {
        return this.isFavorite;
    }

    setIsFavorite(isFavorite: boolean) {
        this.validateIsFavorite(isFavorite);
        this.isFavorite = isFavorite;
    }

    getNotes(): string | undefined {
        return this.notes;
    }

    setNotes(notes?: string) {
        this.validateNotes(notes);
        this.notes = notes ? notes.trim() : undefined;
    }

    getSource(): string | undefined {
        return this.source;
    }

    setSource(source?: string) {
        this.validateSource(source);
        this.source = source ? source.trim() : undefined;
    }

    getScheduledDate(): Date | undefined {
        return this.scheduledDate;
    }

    setScheduledDate(scheduledDate?: Date | null) {
        this.scheduledDate = scheduledDate ?? undefined;
    }

    // validate URLs
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    // separate update favorite as it might be the most frequently used
    updateFavoriteStatus(isFavorite: boolean) {
        this.setIsFavorite(isFavorite);
    }

    updateRecipe(updateInput: RecipeUpdateInput) {
        if (updateInput.title !== undefined) {
            this.setTitle(updateInput.title);
        }
        if (updateInput.instructions !== undefined) {
            this.setInstructions(updateInput.instructions);
        }
        if (updateInput.cookingTime !== undefined) {
            this.setCookingTime(updateInput.cookingTime);
        }
        if (updateInput.category !== undefined) {
            this.setCategory(updateInput.category as RecipeCategory);
        }
        if (updateInput.ingredients !== undefined) {
            updateInput.ingredients.forEach((ingredientUpdate) => {
                const existingIngredient = this.ingredients.find(
                    (ingredient) =>
                        ingredient.getIngredientId() === ingredientUpdate.ingredient.getId()
                );
                if (existingIngredient) {
                    existingIngredient.setUnit(ingredientUpdate.unit);
                    existingIngredient.setQuantity(ingredientUpdate.quantity);
                } else {
                    this.addIngredient(
                        new RecipeIngredient({
                            recipeId: this.id ?? 0,
                            ingredientId: ingredientUpdate.ingredient.getId() ?? 0,
                            unit: ingredientUpdate.unit,
                            quantity: ingredientUpdate.quantity,
                            ingredient: ingredientUpdate.ingredient,
                        })
                    );
                }
            });
        }
        if (updateInput.imageUrl !== undefined) {
            this.setImageUrl(updateInput.imageUrl);
        }
        if (updateInput.isFavorite !== undefined) {
            this.setIsFavorite(updateInput.isFavorite);
        }
        if (updateInput.notes !== undefined) {
            this.setNotes(updateInput.notes);
        }
        if (updateInput.source !== undefined) {
            this.setSource(updateInput.source);
        }
        if (updateInput.scheduledDate !== undefined) {
            this.setScheduledDate(updateInput.scheduledDate);
        }
    }

    // QUESTION: we were getting errors without a toJSON() method
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            instructions: this.instructions,
            cookingTime: this.cookingTime,
            category: this.category,
            ingredients: this.ingredients.map((ingredient) => ingredient.toJSON()),
            imageUrl: this.imageUrl,
            isFavorite: this.isFavorite,
            notes: this.notes,
            source: this.source,
            scheduledDate: this.scheduledDate,
        };
    }

    equals(recipe: Recipe): boolean {
        return (
            (this.title === recipe.getTitle() &&
                this.instructions === recipe.getInstructions() &&
                this.cookingTime === recipe.getCookingTime() &&
                this.category === recipe.getCategory() &&
                this.imageUrl === recipe.getImageUrl() &&
                this.isFavorite === recipe.getIsFavorite() &&
                this.notes === recipe.getNotes() &&
                this.source === recipe.getSource() &&
                (this.ingredients?.length ?? 0) === (recipe.getIngredients()?.length ?? 0) &&
                this.ingredients?.every((ingredient, index) => {
                    const otherIngredient = recipe.getIngredients()?.[index];
                    return otherIngredient !== undefined && ingredient.equals(otherIngredient);
                })) ??
            false
        );
    }
}
