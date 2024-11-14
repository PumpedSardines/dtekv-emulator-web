import { useCallback } from "react";
import styles from "./Button.module.css";
import { useCpuContext } from "../../../../contexts/CpuContext";

function Button() {
  const { setButtonState } = useCpuContext();

  const mouseDownHandler = useCallback(() => {
    setButtonState(true);
  }, [setButtonState]);

  const mouseLeaveHandler = useCallback(() => {
    setButtonState(false);
  }, [setButtonState]);

  const mouseUpHandler = useCallback(() => {
    setButtonState(false);
  }, [setButtonState]);

  return (
    <button
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseLeaveHandler}
      className={styles.button}
    >
      <div className={styles.innerButton} />
      <div className={styles.screw} />
      <div className={styles.screw} />
      <div className={styles.screw} />
      <div className={styles.screw} />
    </button>
  );
}

export default Button;
