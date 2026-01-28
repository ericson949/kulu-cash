import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  goalId: string;
  amount: number;
  date: string; // ISO String
  type: 'deposit' | 'withdrawal';
  proofUri?: string; // Local URI for Story 3.1
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  clearTransactions: (goalId: string) => void; // For Debug/Reset
  getTransactionsByGoal: (goalId: string) => Transaction[];
  getTotalDeposited: (goalId: string) => number;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          {
            ...transaction,
            id: Date.now().toString() + Math.random().toString().slice(2),
          },
          ...state.transactions, // Newest first
        ],
      })),

      clearTransactions: (goalId) => set((state) => ({
          transactions: state.transactions.filter(t => t.goalId !== goalId)
      })),

      getTransactionsByGoal: (goalId) => {
          return get().transactions.filter(t => t.goalId === goalId);
      },

      getTotalDeposited: (goalId) => {
          return get().transactions
            .filter(t => t.goalId === goalId && t.type === 'deposit')
            .reduce((sum, t) => sum + t.amount, 0);
      }
    }),
    {
      name: 'kulu-transactions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
