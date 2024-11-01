import { Profile } from './profile';
import { Recipe } from './recipe';
import { Schedule } from './schedule';

export class User {
    private id?: number;
    private username: string;
    private password: string;
    private profile: Profile;
    private recipes?: Recipe[];
    private schedule?: Schedule;

    constructor(user: {
        id?: number;
        username: string;
        password: string;
        profile: Profile;
        recipes?: Recipe[];
        schedule?: Schedule;
    }) {
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.profile = user.profile;
        this.recipes = user.recipes || [];
        this.schedule = user.schedule;
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

    getProfile(): Profile {
        return this.profile;
    }

    setProfile(profile: Profile) {
        this.profile = profile;
    }

    getRecipes(): Recipe[] | undefined {
        return this.recipes;
    }

    getSchedules(): Schedule | undefined {
        return this.schedule;
    }

    addRecipe(recipe: Recipe): void {
        this.recipes?.push(recipe);
    }

    getSchedule(): Schedule | undefined {
        return this.schedule;
    }

    setSchedule(schedule: Schedule) {
        this.schedule = schedule;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            profile: this.profile ? this.profile.toJSON() : undefined,
            recipes: this.recipes ? this.recipes.map((recipe) => recipe.toJSON()) : undefined,
            schedule: this.schedule ? this.schedule.toJSON() : undefined,
        };
    }

    equals(user: User): boolean {
        return this.username === user.getUsername() && this.password === user.getPassword();
    }
}
