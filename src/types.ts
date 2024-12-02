export type HexDisplays = [number, number, number, number, number, number];
export type Switches = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
];
export type LedStrip = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
];
export type UartEvent = { type: "clear" } | { type: "write"; content: string };
export type UartCallback = (event: UartEvent) => void;
export type CpuLoadCallback = () => void;
export type CpuHardResetCallback = () => void;

export type View = "emulator" | "settings";

export type ButtonBehavior = "momentary" | "toggle";
