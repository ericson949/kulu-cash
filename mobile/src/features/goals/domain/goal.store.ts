import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number; // Calculated: brickAmount * duration
  brickAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  duration: number; // Number of occurrences
  startDate: string; // ISO Date String
  imageUri?: string;
  tontineType: 'fixed' | 'variable_b';
  initialBalance?: number; // For retroactive goals
  createdAt: number;
}

export interface GoalState {
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) => set((state) => ({
        goals: [
          ...state.goals,
          {
            ...goal,
            id: Date.now().toString(),
            createdAt: Date.now(),
          },
        ],
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      })),
    }),
    {
      name: 'kulu-goals-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
