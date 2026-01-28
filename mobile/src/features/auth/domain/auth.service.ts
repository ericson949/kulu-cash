import { auth } from '@/src/shared/config/firebase';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signInAnonymous: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),

  signInAnonymous: async () => {
    try {
      set({ isLoading: true });
      await signInAnonymously(auth);
      // Listener in _layout or App.tsx will catch the user update
    } catch (error) {
      console.error("Auth Error (Anon):", error);
      set({ isLoading: false });
    }
  }
}));

// Helper to initialize listener
export const initializeAuthListener = () => {
    onAuthStateChanged(auth, (user) => {
        useAuthStore.getState().setUser(user);
        if (user) {
            console.log("🔒 User authenticated anonymously:", user.uid);
        } else {
            console.log("🔓 User signed out");
        }
    });
};
