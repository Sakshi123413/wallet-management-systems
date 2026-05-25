import { create } from 'zustand';

export const useSidebarStore = create((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));
