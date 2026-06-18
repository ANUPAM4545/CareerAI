import { create } from 'zustand'

interface UserProfile {
  id: string
  fullName: string
  targetRole: string
  experienceLevel: string
  preferredLanguage: string
  preferredInputMode: string
}

interface UserState {
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}))
