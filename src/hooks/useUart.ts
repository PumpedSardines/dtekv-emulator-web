import { useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  cpuHardResetCallbacksAtom,
  cpuLoadCallbacksAtom,
  uartCallbacksAtom,
} from "../atoms";
import { UartCallback } from "../types";

function useUart(cb: UartCallback) {
  const setUartCallbacks = useSetAtom(uartCallbacksAtom);
  const setCpuLoadCallbacks = useSetAtom(cpuLoadCallbacksAtom);
  const setCpuHardResetCallbacks = useSetAtom(cpuHardResetCallbacksAtom);

  useEffect(() => {
    const clearFn = () => {
      cb({ type: "clear" });
    };

    setUartCallbacks((prev) => [...prev, cb]);
    setCpuLoadCallbacks((prev) => [...prev, clearFn]);
    setCpuHardResetCallbacks((prev) => [...prev, clearFn]);

    return () => {
      setUartCallbacks((prev) => prev.filter((c) => c !== cb));
      setCpuLoadCallbacks((prev) => prev.filter((c) => c !== clearFn));
      setCpuHardResetCallbacks((prev) => prev.filter((c) => c !== clearFn));
    };
  }, [setUartCallbacks, setCpuLoadCallbacks, cb, setCpuHardResetCallbacks]);
}

export default useUart;
