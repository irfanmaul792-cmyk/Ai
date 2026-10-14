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

export type PhotoType = 'fridge' | 'receipt' | 'countertop';

export interface UploadedPhoto {
  id: string;
  url: string;
  label: string;
  isSample?: boolean;
  type?: PhotoType;
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
  imageUrl?: string;
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

// Weekly Meal Planner Types
export type MealSlot = 'breakfast' | 'lunch' | 'dinner';
export type DayOfWeek = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';

export interface PlannedMeal {
  id: string;
  day: DayOfWeek;
  slot: MealSlot;
  recipeId: string;
  recipeTitle: string;
  recipeImage?: string;
  servings: number;
  calories?: number;
  cookTimeMinutes?: number;
  isCooked?: boolean;
  notes?: string;
}

export interface WeeklyMealPlan {
  weekId: string;
  title?: string;
  meals: PlannedMeal[];
  updatedAt: number;
}

// Vision Analysis Types
export interface DetectedIngredientItem {
  name: string;
  quantity: string;
  category: IngredientCategory | string;
  urgency: UrgencyLevel | string;
  shelf: IngredientShelf | string;
  icon?: string;
  price?: string;
}

export interface VisionAnalysisResult {
  isAiVision: boolean;
  usedModel?: string;
  summary: string;
  isReceipt?: boolean;
  storeName?: string;
  totalSpent?: string;
  detectedIngredients: DetectedIngredientItem[];
  detectedType?: 'fridge' | 'receipt' | 'mixed';
}

export interface UserAccountData {
  userId: string;
  ingredients: Ingredient[];
  selectedFridgeIds: Record<string, boolean>;
  shoppingItems: ShoppingItem[];
  favoriteRecipes: Recipe[];
  filters: FilterOptions;
  photos: UploadedPhoto[];
  weeklyPlan?: WeeklyMealPlan;
  updatedAt: number;
}
