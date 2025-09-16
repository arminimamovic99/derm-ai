export type AnalysisResult = {
    explanation: string;
    stepByStepPlan: Record<string, string>;
    recommendedProducts: string[];
    thingsToAvoid: string;
    lifestyleHabitsToImplementOrChange: string;
    analysisSucceeded: boolean;
  };
  