import { Cpu, init_panic_hook } from "dtekv_emulator_web";
import { HexDisplays, LedStrip } from "./types";
import {
  buttonPressedAtom,
  cpuLoadCallbacksAtom,
  hasLoadedAtom,
  hexDisplaysAtom,
  ledStripAtom,
  store,
  switchesAtom,
  uartCallbacksAtom,
  vgaBufferAtom,
  cpuHardResetCallbacksAtom,
  clockFrequencyAtom,
} from "./atoms";

init_panic_hook();

const cpu = Cpu.new();
let currentLoadedBinary: Uint8Array | null = null;

/**
 * Sets the button state in the CPU
 */
function updateButton() {
  const currentState = cpu.get_button();
  const button = store.get(buttonPressedAtom);
  if (currentState !== button) {
    cpu.set_button(button);
  }
}

function updateSwitches() {
  const switches = store.get(switchesAtom);

  for (let i = 0; i < 10; i++) {
    const current = cpu.get_switch(i);

    if (current !== switches[i]) {
      cpu.set_switch(i, switches[i]);
    }
  }
}

/**
 * Checks current hex display state in the CPU and updates the store if it has changed.
 */
function updateHexDisplays() {
  const newHexDisplays: HexDisplays = [0, 0, 0, 0, 0, 0];
  const hexDisplays = store.get(hexDisplaysAtom);
  let shouldUpdate = false;
  for (let i = 0; i < 6; i++) {
    newHexDisplays[i] = cpu.get_hex_display(i);
    if (newHexDisplays[i] !== hexDisplays[i]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    store.set(hexDisplaysAtom, newHexDisplays);
  }
}

function updateLedStrip() {
  const newLedStrip: LedStrip = new Array(10).fill(false) as LedStrip;
  const ledStrip = store.get(ledStripAtom);
  let shouldUpdate = false;
  for (let i = 0; i < 10; i++) {
    newLedStrip[i] = cpu.get_led(i);
    if (newLedStrip[i] !== ledStrip[i]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    store.set(ledStripAtom, newLedStrip);
  }
}

/**
 * Checks the VGA frame buffer in the CPU and updates the store if it has changed.
 */
function updateVgaFrameBuffer() {
  if (cpu.did_vga_frame_buffer_update()) {
    store.set(vgaBufferAtom, cpu.get_vga_frame_buffer());
  }
}

/**
 * Clear the UART queue and pass it to the callbacks
 */
function flushUart() {
  const flushed = cpu.flush_uart();
  if (flushed !== "") {
    const uartCallbacks = store.get(uartCallbacksAtom);
    uartCallbacks.forEach((callback) => {
      callback({ type: "write", content: flushed });
    });
  }
}

const fps = 60;
const timePerFrame = 1000 / fps;
let currentFrequency = 0;
let start = performance.now();
let cycles = 500_000;
const desiredCycles = 30_000_000;

function cpuLoop() {
  if (!store.get(hasLoadedAtom)) {
    requestAnimationFrame(cpuLoop);
    return;
  }
  const startOfLoop = performance.now();

  updateButton();
  updateSwitches();

  cpu.handle_interrupt();
  cpu.clock(cycles);

  updateHexDisplays();
  updateLedStrip();
  updateVgaFrameBuffer();
  flushUart();

  currentFrequency += cycles;
  if (performance.now() - start > 1000) {
    store.set(clockFrequencyAtom, currentFrequency);
    currentFrequency = 0;
    start = performance.now();
  }

  const endOfLoop = performance.now();
  const timeTook = endOfLoop - startOfLoop;

  if (timeTook < timePerFrame) {
    cycles = Math.min(desiredCycles / fps, Math.floor(cycles * 1.02));
  } else {
    cycles = Math.max(1, Math.floor(cycles * 0.98));
  }
  
  const wait = timePerFrame - (performance.now() - startOfLoop);
  setTimeout(cpuLoop, Math.max(0, wait));
}

export function hardReset() {
  cpu.set_to_new();
  store.set(hasLoadedAtom, false);
  currentLoadedBinary = null;
  store.get(cpuHardResetCallbacksAtom).forEach((callback) => {
    callback();
  });
}

export function loadBinary(binary: Uint8Array) {
  currentLoadedBinary = new Uint8Array(binary);
  cpu.store_at(0, new Uint8Array(binary));
  cpu.reset();
  const loadCallbacks = store.get(cpuLoadCallbacksAtom);
  loadCallbacks.forEach((cb) => cb());
  store.set(vgaBufferAtom, cpu.get_vga_frame_buffer());
  store.set(hasLoadedAtom, true);
}

export function reload() {
  if (currentLoadedBinary) {
    loadBinary(currentLoadedBinary);
  }
}

export function startCpuLoop() {
  requestAnimationFrame(cpuLoop);
}

export function storeAt(addr: number, data: Uint8Array) {
  cpu.store_at(addr, data);
}

export function loadAt(addr: number, length: number): Uint8Array {
  return cpu.load_at(addr, length);
}
