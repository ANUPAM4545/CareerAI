import { create } from 'zustand';

interface UserProfile {
  id: string;
  full_name: string | null;
  target_role: string | null;
  experience_level: string | null;
  preferred_language: string;
  preferred_input_mode: string;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
}));
