export type MessageContent = string;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: MessageContent;
  image?: string; // For displaying the user-uploaded image preview
}

// Fix: Add missing MathSolution interface to resolve compilation error in ResultVisualizer.tsx.
export interface MathSolution {
  problem: string;
  solutionSteps: string[];
  finalAnswer: string;
  visualizationData?: { name: string; value: number }[];
}
