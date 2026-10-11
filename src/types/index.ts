export type IngredientCategory = 'protein' | 'sayur' | 'karbo' | 'bumbu' | 'dairy' | 'lainnya';

export type UrgencyLevel = 'urgent' | 'medium' | 'safe';

export type IngredientShelf = 'meat' | 'crisper' | 'chiller' | 'freezer' | 'door';

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: IngredientCategory;
  urgency: UrgencyLevel;
  shelf?: IngredientShelf;
  icon?: string;
  daysRemaining?: number;
  selected?: boolean;
}

export interface UploadedPhoto {
  id: string;
  url: string;
  label: string;
  isSample?: boolean;
}

export interface FilterOptions {
  budget: string;
  cookingTime: string;
  servings: string;
  preferences: string;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category?: IngredientCategory;
  recipeTitle?: string;
  isBought: boolean;
  createdAt: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  story?: string;
  chefTip?: string;
  matchPercentage: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficulty: 'Mudah' | 'Praktis' | 'Sedang' | string;
  estimatedCost: string;
  calories: number;
  servings: number;
  urgencyMessage?: string;
  isAiGenerated?: boolean;
  ingredients: {
    name: string;
    amount: string;
    isOwned: boolean;
    urgentPriority?: boolean;
  }[];
  steps: RecipeStep[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tasteProfile: string[];
  theme?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface UserAccountData {
  userId: string;
  ingredients: Ingredient[];
  selectedFridgeIds: Record<string, boolean>;
  shoppingItems: ShoppingItem[];
  favoriteRecipes: Recipe[];
  filters: FilterOptions;
  photos: UploadedPhoto[];
  updatedAt: number;
}
