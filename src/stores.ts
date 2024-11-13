import { create } from "zustand";

interface EmulatorState {
  hexDisplays: number[];
  switches: boolean[];
  hexDisplayHandle: (index: number) => {
    set: (value: number) => void;
  }
}

export const useEmulatorState = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export const useVgaState = create((set) => ({
  img: null,
  setImg: (img) => set({ img }),
}));
