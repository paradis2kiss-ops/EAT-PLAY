
export interface Recipe {
  name: string;
  icon: string;
  tags: string[];
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  steps?: string[];
  aiReason?: string;
  
  // Detailed Nutritional Breakdown
  fiber?: number; // g
  sugar?: number; // g
  sodium?: number; // mg
  potassium?: number; // mg
  cholesterol?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  phosphorus?: number; // mg
}

export interface Disease {
  id: string;
  name: string;
  icon: string;
  subOptions?: { id: string; name: string }[];
}

export interface DiseaseCategory {
  name: string;
  icon: string;
  diseases: Disease[];
}

export interface DiseaseSelection {
    key: string;
    name: string;
}

export interface MealPlan {
  [day: string]: string[];
}

export interface SavedPlan {
  name: string;
  date: string;
  period: 'week' | 'month';
  plan: MealPlan;
}

export interface ModifiedRecipe {
  name: string;
  modifiedIngredients: string[];
  modifiedDescription?: string;
  reason: string;
  instructions?: string[];
}

export interface Meal {
  time: '아침' | '점심' | '저녁' | '간식';
  menu: string;
  note: string;
}

export interface DailyPlan {
  day: string;
  meals: Meal[];
}

export interface AiMealPlan {
  title: string;
  reason: string;
  plan: DailyPlan[];
}

export interface FoodLogEntry {
  id: string;
  time: '아침' | '점심' | '저녁' | '간식';
  menu: string;
  calories: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: FoodLogEntry[];
}