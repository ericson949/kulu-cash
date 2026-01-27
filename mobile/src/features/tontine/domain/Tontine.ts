export type TontineType = 'FIXED' | 'VARIABLE_A' | 'VARIABLE_B';

export interface SavingGoal {
  name: string;
  description?: string;
  targetAmount: number;
  imageUrl?: string;
}

export interface Tontine {
  id: string;
  type: TontineType;
  savingGoal: SavingGoal;
  brickAmount: number;
  createdAt: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export const createTontine = (
  name: string,
  targetAmount: number,
  brickAmount: number,
  type: TontineType = 'VARIABLE_B',
  imageUrl?: string
): Tontine => {
  return {
    id: crypto.randomUUID(),
    type,
    savingGoal: {
      name,
      targetAmount,
      imageUrl,
    },
    brickAmount,
    createdAt: new Date(),
    status: 'ACTIVE',
  };
};
