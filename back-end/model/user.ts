import { Profile } from './profile';
import { Recipe } from './recipe';
import { Schedule } from './schedule';
import { Role } from '../types';
import {
    User as UserPrisma,
    Profile as ProfilePrisma,
    Recipe as RecipePrisma,
    Schedule as SchedulePrisma,
    RecipeIngredient as RecipeIngredientPrisma,
} from '@prisma/client';

export class User {
    private id?: number;
    private username: string;
    private password: string;
    private profile?: Profile | null;
    private recipes?: Recipe[];
    private schedule?: Schedule | null;
    private role: Role;

    constructor(user: {
        id?: number;
        username: string;
        password: string;
        profile?: Profile | null;
        recipes?: Recipe[];
        schedule?: Schedule | null;
        role: Role;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.profile = user.profile ?? null;
        this.recipes = user.recipes || [];
        this.schedule = user.schedule ?? null;
        this.role = user.role;
    }

    static from({
        id,
        username,
        password,
        profile,
        recipes,
        schedule,
        role,
    }: UserPrisma & {
        profile?: ProfilePrisma | null;
        recipes?: (RecipePrisma & { ingredients: RecipeIngredientPrisma[] })[];
        schedule?:
            | (SchedulePrisma & {
                  recipes: (RecipePrisma & { ingredients: RecipeIngredientPrisma[] })[];
              })
            | null;
        role: Role;
    }): User {
        return new User({
            id,
            username,
            password,
            profile: profile ? Profile.from(profile) : null,
            recipes: recipes ? recipes.map((recipe) => Recipe.from(recipe)) : undefined,
            schedule: schedule ? Schedule.from(schedule) : null,
            role: role as Role,
        });
    }

    validate(user: {
        id?: number;
        username: string;
        password: string;
        profile?: Profile | null;
        recipes?: Recipe[];
        schedule?: Schedule | null;
        role: Role;
    }): void {
        if (user.id !== undefined && (!Number.isInteger(user.id) || user.id <= 0)) {
            throw new Error('ID must be a positive integer');
        }
        if (!user.username || user.username.trim().length === 0) {
            throw new Error('Username is required and cannot be empty');
        }
        if (!user.password || user.password.trim().length === 0) {
            throw new Error('Password is required and cannot be empty');
        }
        if (user.recipes !== undefined && !Array.isArray(user.recipes)) {
            throw new Error('Recipes must be an array');
        }
        if (
            user.schedule !== undefined &&
            user.schedule !== null &&
            !(user.schedule instanceof Schedule)
        ) {
            throw new Error('Schedule must be an instance of Schedule or null');
        }
        if (!user.role) {
            throw new Error('Role is required');
        }
    }

    hasRecipe(recipeId: number): boolean {
        return this.recipes?.some((recipe) => recipe.getId() === recipeId) ?? false;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }

    getProfile(): Profile | null | undefined {
        return this.profile;
    }

    getRecipes(): Recipe[] | undefined {
        return this.recipes;
    }

    getSchedules(): Schedule | null | undefined {
        return this.schedule;
    }

    getRole(): Role {
        return this.role;
    }

    addRecipe(recipe: Recipe): void {
        this.recipes?.push(recipe);
    }

    getSchedule(): Schedule | null | undefined {
        return this.schedule;
    }

    setSchedule(schedule: Schedule) {
        this.schedule = schedule;
    }

    setProfile(profile: Profile) {
        this.profile = profile;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            profile: this.profile ? this.profile.toJSON() : undefined,
            recipes: this.recipes ? this.recipes.map((recipe) => recipe.toJSON()) : undefined,
            schedule: this.schedule ? this.schedule.toJSON() : undefined,
            role: this.role,
        };
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.password === user.getPassword() &&
            this.role === user.role
        );
    }
}
