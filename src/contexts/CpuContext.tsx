// Main module to interface with the CPU emulator

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { Cpu, init_panic_hook } from "dtekv_emulator_web";

init_panic_hook();

type HexDisplays = [number, number, number, number, number, number];
type Switches = [
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
type UartCallback = (text: string) => void;
type LoadCallback = () => void;

const CpuContext = createContext<{
  hexDisplays: HexDisplays;
  isRunning: boolean;
  hasLoaded: boolean;
  setButtonState: (on: boolean) => void;
  setSwitchState: (switches: Switches) => void;
  onLoad: (cb: LoadCallback) => void;
  removeOnLoad: (cb: LoadCallback) => void;
  onUart: (cb: UartCallback) => void;
  removeOnUart: (cb: UartCallback) => void;
  loadBin: (bin: Uint8Array) => void;
  vgaFrameBuffer: Uint8Array | null;
  reset: () => void;
}>({
  vgaFrameBuffer: null,
  loadBin: () => {},
  isRunning: false,
  hasLoaded: false,
  onLoad: () => {},
  removeOnLoad: () => {},
  onUart: () => {},
  removeOnUart: () => {},
  hexDisplays: [0, 0, 0, 0, 0, 0],
  setButtonState: () => {},
  setSwitchState: () => {},
  reset: () => {},
});

export function useCpuContext() {
  return useContext(CpuContext);
}

type UartListenEvent = { type: "clear" } | { type: "write"; content: string };
export function useUart(cb: (event: UartListenEvent) => void) {
  const { onUart, removeOnUart, onLoad, removeOnLoad } = useCpuContext();

  useEffect(() => {
    const f = (t: string) => {
      cb({
        type: "write",
        content: t,
      });
    };
    onUart(f);
    return () => removeOnUart(f);
  }, [cb, onUart, removeOnUart]);

  useEffect(() => {
    const f = () => {
      cb({
        type: "clear",
      });
    };
    onLoad(f);
    return () => removeOnLoad(f);
  }, [cb, onLoad, removeOnLoad]);
}

type CpuContextProviderProps = {
  children: React.ReactNode;
};

// Hack to not spam generate new Cpu's everytime this component is refreshed
// If it's possible to pass a function or similair to useRef, that would be preferable :)
const initialCpu = Cpu.new();

export function CpuContextProvider(props: CpuContextProviderProps) {
  const cpuRef = useRef(initialCpu);
  const [uartCallbacks, setUartCallbacks] = useState<UartCallback[]>([]);
  const [loadCallbacks, setLoadCallbacks] = useState<LoadCallback[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentLoaded = useRef<Uint8Array | null>(null);
  const button = useRef(false);
  const switches = useRef<Switches>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [hexDisplays, setHexDisplays] = useState<HexDisplays>([
    0, 0, 0, 0, 0, 0,
  ]);
  const [vgaFrameBuffer, setVgaFrameBuffer] = useState<Uint8Array | null>(null);

  const setSwitchState = useCallback((inSwitches: boolean[]) => {
    for (let i = 0; i < 10; i++) {
      switches.current[i] = inSwitches[i]!;
    }
  }, []);

  const setButtonState = useCallback((on: boolean) => {
    button.current = on;
  }, []);

  const onUart = useCallback((cb: UartCallback) => {
    setUartCallbacks((uartCallbacks) => [...uartCallbacks, cb]);
  }, []);
  const removeOnUart = useCallback((cb: UartCallback) => {
    setUartCallbacks((uartCallbacks) => {
      return uartCallbacks.filter((v) => v !== cb);
    });
  }, []);

  const onLoad = useCallback((cb: LoadCallback) => {
    setLoadCallbacks((loadCallbacks) => [...loadCallbacks, cb]);
  }, []);
  const removeOnLoad = useCallback((cb: LoadCallback) => {
    setLoadCallbacks((loadCallbacks) => {
      return loadCallbacks.filter((v) => v !== cb);
    });
  }, []);

  const loadBin = useCallback(
    (bin: Uint8Array) => {
      currentLoaded.current = new Uint8Array(bin);
      cpuRef.current.set_to_new();
      cpuRef.current.load(new Uint8Array(bin));
      cpuRef.current.reset();
      setHasLoaded(true);
      setIsRunning(true);
      loadCallbacks.forEach((cb) => cb());
      console.log(cpuRef.current.get_vga_frame_buffer());
      setVgaFrameBuffer(cpuRef.current.get_vga_frame_buffer());
    },
    [loadCallbacks],
  );

  const reset = useCallback(() => {
    if (currentLoaded.current) {
      loadBin(currentLoaded.current);
    }
  }, [loadBin]);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      if (!isRunning) {
        return;
      }

      while (!abortController.signal.aborted && isRunning) {
        const currentState = cpuRef.current.get_button();
        if (currentState !== button.current) {
          cpuRef.current.set_button(button.current);
        }

        for (let i = 0; i < 10; i++) {
          const current = cpuRef.current.get_switch(i);

          if (current !== switches.current[i]) {
            cpuRef.current.set_switch(i, switches.current[i]);
          }
        }

        cpuRef.current.handle_interrupt();
        cpuRef.current.clock(100_000);

        const newHexDisplays: HexDisplays = [0, 0, 0, 0, 0, 0];
        let shouldUpdate = false;
        for (let i = 0; i < 6; i++) {
          newHexDisplays[i] = cpuRef.current.get_hex_display(i);
          if (newHexDisplays[i] !== hexDisplays[i]) {
            shouldUpdate = true;
          }
        }
        if (shouldUpdate) {
          setHexDisplays(newHexDisplays);
        }
        if (cpuRef.current.did_vga_frame_buffer_update()) {
          setVgaFrameBuffer(cpuRef.current.get_vga_frame_buffer());
        }

        const flushed = cpuRef.current.flush_uart();
        if (flushed !== "") {
          uartCallbacks.forEach((cb) => cb(flushed));
        }

        await new Promise((resolve) => window.requestAnimationFrame(resolve));
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [hexDisplays, isRunning, uartCallbacks]);

  return (
    <CpuContext.Provider
      value={{
        setSwitchState,
        hexDisplays,
        loadBin,
        isRunning,
        setButtonState,
        onUart,
        onLoad,
        removeOnLoad,
        removeOnUart,
        hasLoaded,
        vgaFrameBuffer,
        reset,
      }}
    >
      {props.children}
    </CpuContext.Provider>
  );
}
