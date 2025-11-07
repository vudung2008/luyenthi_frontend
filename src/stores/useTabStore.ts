// useTabStore.ts
import { create } from "zustand";

interface TabState {
    cls: string; // ví dụ dashboard, classId...
    tab: string;
    setClass: (cls: string) => void;
    setTab: (tab: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
    cls: '',
    tab: 'dashboard',
    setTab: (tab) => set({ tab }),
    setClass: (cls) => set({ cls: cls }),
}));
