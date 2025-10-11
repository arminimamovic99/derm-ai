export interface FullAnalysisRecord {
  id: number
  created_at: string
  userId: string
  result: string
  image_base64: string
  recommended_products: string
}

export interface AnalysisResult {
  explanation: string;
  stepByStepPlan: [
    day1: {
      morning: string;
      afternoon: string;
    },
    day2: {
      morning: string;
      afternoon: string;
    }
  ];
  recommendedProducts: string[];
  thingsToAvoid: string;
  lifestyleHabitsToImplementOrChange: string;
  analysisSucceeded: boolean;
}

export interface RecommendedProduct {
  name: string;
  manufacturer: string;
  description: string;
  imageQuery: string;
  imagePrompt: string;
}

export interface SkinSubScores {
  hydration: number;
  acne: number;
  redness: number;
  texture: number;
  wrinkles: number;
}

export interface StepPlanEntry {
  day: number;
  morning: string;
  afternoon: string;
}

export interface SkinAnalysisResponse {
  analysisSucceeded: boolean;
  skinHealthScore: number; // 0–100 average of subscores
  subScores: SkinSubScores;
  explanation: string;
  stepByStepPlan: StepPlanEntry[]; // must contain 14 days
  recommendedProducts: RecommendedProduct[]; // manufacturer + model names
  thingsToAvoid: string;
  lifestyleHabitsToImplementOrChange: string;
  scoreExplanation: string,
  subScoreExplanations: SubScoreExplanations
}

export interface SubScoreExplanations {
  hydration: string,
  acne: string,
  redness: string,
  texture: string,
  wrinkles: string
}

export interface RecommendedAmazonProduct {
  name: string;
  image: string;
  price: string;
  url: string
}