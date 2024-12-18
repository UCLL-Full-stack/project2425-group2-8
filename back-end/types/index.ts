import { Ingredient } from '../model/ingredient';

type Role = 'admin' | 'user' | 'guest';

type UserSignupInput = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
};

type UserLoginInput = {
    username: string;
    password: string;
};

type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
    role: string;
};

type ProfileUpdateInput = {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
};

type NewRecipeInput = {
    title: string;
    instructions: string;
    cookingTime: number;
    category: string;
    ingredients: {
        name: string;
        quantity: number;
        unit: string;
    };
};

type RecipeUpdateInput = {
    title?: string;
    instructions?: string;
    cookingTime?: number;
    category?: string;
    ingredients?: {
        ingredient: Ingredient;
        unit: string;
        quantity: number;
    }[];
    imageUrl?: string;
    isFavorite?: boolean;
    notes?: string;
    source?: string;
    scheduledDate?: Date;
};

type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

type IngredientCategory =
    | 'Produce' // Combines Vegetables & Fruits
    | 'Meat & Fish' // Combines Meats & Seafood
    | 'Dairy & Eggs'
    | 'Pantry' // Combines Grain, Pasta, Canned, Baking, Spices, Oils
    | 'Snacks'
    | 'Beverages'
    | 'Frozen'
    | 'Other';

export {
    IngredientCategory,
    UserSignupInput,
    UserLoginInput,
    ProfileUpdateInput,
    NewRecipeInput,
    RecipeUpdateInput,
    RecipeCategory,
    AuthenticationResponse,
    Role,
};
