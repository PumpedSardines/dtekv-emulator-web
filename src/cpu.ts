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

function cpuLoop() {
  updateButton();
  updateSwitches();

  cpu.handle_interrupt();
  cpu.clock(100_000);

  updateHexDisplays();
  updateLedStrip();
  updateVgaFrameBuffer();
  flushUart();

  requestAnimationFrame(cpuLoop);
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
  cpu.load(new Uint8Array(binary));
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

export function loadDataAt(addr: number, data: Uint8Array) {
  cpu.load_data_at(addr, data);
}

export function readDataAt(addr: number, length: number): Uint8Array {
  return cpu.read_data_at(addr, length);
}
