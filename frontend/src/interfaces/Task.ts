// interfaces/Task.ts

export interface Task {
    id: number;
    name: string;
    description: string;
    rewards: number; // Assuming rewards are numeric, e.g., points
    status: 'In Progress' | 'Reviewing' | 'Completed';
    received?: boolean;
    images: string[]; // Array of image URLs
  }
  