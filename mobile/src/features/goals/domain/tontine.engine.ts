import { differenceInCalendarWeeks, differenceInCalendarMonths, differenceInCalendarDays, startOfDay, addWeeks, addMonths, addDays, isBefore } from 'date-fns';
import { SavingsGoal } from './goal.store';

export const TontineEngine = {
  /**
   * Calculates the amount due for a specific period index (1-based).
   * @param type 'fixed' or 'variable_b'
   * @param brickAmount The base amount
   * @param periodIndex The index of the period (1 for first week/month, 2 for second, etc.)
   */
  calculateDueForPeriod: (type: 'fixed' | 'variable_b', brickAmount: number, periodIndex: number): number => {
    if (periodIndex < 1) return 0;
    
    if (type === 'fixed') {
      return brickAmount;
    } else {
      // variable_b: Arithmetic progression (1x, 2x, 3x...)
      return brickAmount * periodIndex;
    }
  },

  /**
   * Calculates the theoretical total that should have been saved up to the current date.
   * Useful for "Expected Balance" and Retroactive checks.
   */
  calculateExpectedBalance: (goal: SavingsGoal, targetDate: Date = new Date()): number => {
    const start = startOfDay(new Date(goal.startDate));
    const now = startOfDay(targetDate);

    if (isBefore(now, start)) return 0;

    let periodCount = 0;

    if (goal.frequency === 'weekly') {
      // +1 because if we are in week 0 (same week), it counts as period 1 if it started
      periodCount = differenceInCalendarWeeks(now, start) + 1; 
    } else if (goal.frequency === 'monthly') {
      periodCount = differenceInCalendarMonths(now, start) + 1;
    } else if (goal.frequency === 'daily') {
      periodCount = differenceInCalendarDays(now, start) + 1;
    }

    if (periodCount <= 0) return 0;

    // Optimization: Sum of arithmetic progression S_n = n/2 * (2a + (n-1)d)
    // Here a = brickAmount, d = brickAmount. 
    // So S_n = n/2 * (2*brick + (n-1)*brick) = n/2 * (brick * (2 + n - 1)) = n/2 * brick * (n+1)
    // S_n = brick * n * (n+1) / 2
    
    if (goal.tontineType === 'fixed') {
      return periodCount * goal.brickAmount;
    } else {
      // Variable Type B Sum
      return (goal.brickAmount * periodCount * (periodCount + 1)) / 2;
    }
  },

  /**
   * Returns the current period number (1-based) for the goal.
   */
  getCurrentPeriodIndex: (goal: SavingsGoal, targetDate: Date = new Date()): number => {
    const start = startOfDay(new Date(goal.startDate));
    const now = startOfDay(targetDate);
    
    if (isBefore(now, start)) return 0;

    if (goal.frequency === 'weekly') {
        return differenceInCalendarWeeks(now, start) + 1;
    }
    if (goal.frequency === 'monthly') {
        return differenceInCalendarMonths(now, start) + 1;
    }
    if (goal.frequency === 'daily') {
        return differenceInCalendarDays(now, start) + 1;
    }
    return 1;
  }
};
