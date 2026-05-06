import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, UserProfile } from '@/types/auth.types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user: UserProfile) =>
                set({ user, isAuthenticated: true, isLoading: false }),

            clearUser: () =>
                set({ user: null, isAuthenticated: false, isLoading: false }),

            setLoading: (loading: boolean) =>
                set({ isLoading: loading }),
        }),
        {
            name: 'solo-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export function useAuth() {
    const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
        useAuthStore();
    return { user, isAuthenticated, isLoading, setUser, clearUser, setLoading };
}