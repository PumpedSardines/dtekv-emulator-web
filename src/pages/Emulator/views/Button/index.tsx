import { useCallback } from "react";
import styles from "./Button.module.css";
import { useSetAtom } from "jotai";
import { buttonPressedAtom } from "../../../../atoms";

function Button() {
  const setButton = useSetAtom(buttonPressedAtom);

  const mouseDownHandler = useCallback(() => {
    setButton(true);
  }, [setButton]);

  const mouseLeaveHandler = useCallback(() => {
    setButton(false);
  }, [setButton]);

  const mouseUpHandler = useCallback(() => {
    setButton(false);
  }, [setButton]);

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
