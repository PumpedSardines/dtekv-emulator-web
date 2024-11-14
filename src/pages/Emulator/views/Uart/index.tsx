import { useCallback, useRef } from "react";
import { useUart } from "../../../../contexts/CpuContext";
import styles from "./Uart.module.css";

function Uart() {
  const ref = useRef<HTMLTextAreaElement>(null);

  useUart(
    useCallback((event) => {
      const textarea = ref.current;
      if (!textarea) throw new Error("Unreachable");

      switch (event.type) {
        case "write": {
          textarea.value += event.content;
          if (
            textarea.scrollTop >=
            textarea.scrollHeight - textarea.clientHeight - 50
          ) {
            textarea.scrollTop = textarea.scrollHeight;
          }
          break;
        }
        case "clear": {
          textarea.value = "";
          break;
        }
      }
    }, []),
  );

  return (
    <div className={styles.cont}>
      <textarea className={styles.uart} readOnly ref={ref} />
    </div>
  );
}

export default Uart;
