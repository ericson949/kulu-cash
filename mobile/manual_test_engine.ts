import { TontineEngine } from './src/features/goals/domain/tontine.engine';
import { SavingsGoal } from './src/features/goals/domain/goal.store';

// Mock Goal
const mockWeekGoal: SavingsGoal = {
    id: '1',
    name: 'Test Goal',
    targetAmount: 100000,
    brickAmount: 1000,
    frequency: 'weekly',
    duration: 52,
    startDate: new Date().toISOString(), // Starts today
    tontineType: 'variable_b', // Type B
    createdAt: Date.now()
};

// Test 1: Period Index for standard dates
console.log("--- Test 1: Period Index ---");
const idx = TontineEngine.getCurrentPeriodIndex(mockWeekGoal, new Date());
console.log(`Current (Week 1) Index: ${idx} (Expected: 1)`);

// Test 2: Calculate Due for Period 3 (Variable)
// Should be 3 * 1000 = 3000
console.log("--- Test 2: Variable Due Period 3 ---");
const dueP3 = TontineEngine.calculateDueForPeriod('variable_b', 1000, 3);
console.log(`Due Period 3: ${dueP3} (Expected: 3000)`);

// Test 3: Total Expected Balance after 3 weeks (Variable)
// Week 1 (1000) + Week 2 (2000) + Week 3 (3000) = 6000
console.log("--- Test 3: Cumulative Variable Balance (3 weeks) ---");
// Hack: Mock date 2 weeks from now to simulate being in week 3
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 15); // + 15 days = 2 weeks and 1 day later -> Week 3

// Update mock goal to start in past to simulate clean calculated difference
const pastGoal = { ...mockWeekGoal, startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() }; 
// If start was 15 days ago.
// 2 full weeks passed. We are in the 3rd week.
// differenceInWeeks should be 2. +1 = 3.

const totalExp = TontineEngine.calculateExpectedBalance(pastGoal, new Date());
console.log(`Expected Balance after ~2 weeks passed (Week 3 start): ${totalExp}`);
// S_n for n=3: 1000 * 3 * 4 / 2 = 6000.
