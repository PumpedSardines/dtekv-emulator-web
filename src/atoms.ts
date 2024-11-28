import { atom, createStore } from "jotai";
import { INTERNAL_PrdStore } from "jotai/vanilla/store";
import {
  HexDisplays,
  LedStrip,
  Switches,
  UartCallback,
  CpuLoadCallback,
} from "./types";

// Need to add that as there for some reason?
export const store = createStore() as INTERNAL_PrdStore;
export const clockFrequencyAtom = atom(30_000_000);

export const dialogElementAtom = atom<React.ReactNode | null>(null);
export const hasLoadedAtom = atom(false);
export const buttonPressedAtom = atom(false);
export const vgaBufferAtom = atom(new Uint8Array(320 * 240 * 3));
export const hexDisplaysAtom = atom<HexDisplays>([0, 0, 0, 0, 0, 0]);
export const switchesAtom = atom<Switches>(
  new Array(10).fill(false) as Switches,
);
export const ledStripAtom = atom<LedStrip>(
  new Array(10).fill(false) as LedStrip,
);

export const cpuLoadCallbacksAtom = atom<CpuLoadCallback[]>([]);
export const cpuHardResetCallbacksAtom = atom<CpuLoadCallback[]>([]);

export const uartCallbacksAtom = atom<UartCallback[]>([]);
