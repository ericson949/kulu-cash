import { db, auth } from '@/src/shared/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useGoalStore } from '@/src/features/goals/domain/goal.store';
import { useTransactionStore } from '@/src/features/transactions/domain/transaction.store';

interface BackupData {
    goals: any[];
    transactions: any[];
    version: number;
    updatedAt: any;
}

export const SyncService = {
    /**
     * Pushes local state to Firestore under the current user's ID
     */
    pushBackup: async () => {
        const user = auth.currentUser;
        if (!user) {
            console.warn("🚫 Sync Cancelled: No user logged in.");
            return false;
        }

        const goals = useGoalStore.getState().goals;
        const transactions = useTransactionStore.getState().transactions;

        const backupData: BackupData = {
            goals,
            transactions,
            version: 1,
            updatedAt: serverTimestamp()
        };

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, backupData);
            console.log("✅ Backup Successful for user:", user.uid);
            return true;
        } catch (error) {
            console.error("❌ Backup Failed:", error);
            throw error;
        }
    },

    /**
     * Pulls data from Firestore and replaces local state
     */
    pullRestore: async () => {
        const user = auth.currentUser;
        if (!user) {
            console.warn("🚫 Restore Cancelled: No user logged in.");
            return false;
        }

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as BackupData;
                
                // VALIDATION (Basic)
                if (data.goals && Array.isArray(data.goals)) {
                    useGoalStore.setState({ goals: data.goals });
                }
                if (data.transactions && Array.isArray(data.transactions)) {
                    useTransactionStore.setState({ transactions: data.transactions });
                }

                console.log("✅ Restore Successful. Loaded:", data.goals.length, "goals.");
                return true;
            } else {
                console.log("⚠️ No backup found for this user.");
                return false;
            }
        } catch (error) {
            console.error("❌ Restore Failed:", error);
            throw error;
        }
    }
};
