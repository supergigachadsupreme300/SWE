import create from 'zustand'

type UIState = {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  setTheme: (t) => set({ theme: t }),
}))
