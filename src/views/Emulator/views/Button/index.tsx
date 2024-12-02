import { useCallback } from "react";
import styles from "./Button.module.css";
import { useAtom, useAtomValue } from "jotai";
import {
  buttonPressedAtom,
  settingsButtonBehaviorAtom,
} from "../../../../atoms";
import cx from "../../../../utils/cx";

function Button() {
  const [button, setButton] = useAtom(buttonPressedAtom);
  const buttonBehavior = useAtomValue(settingsButtonBehaviorAtom);

  const mouseDownHandler = useCallback(() => {
    switch (buttonBehavior) {
      case "toggle":
        setButton((prev) => !prev);
        break;
      case "momentary":
        setButton(true);
        break;
    }
  }, [setButton, buttonBehavior]);

  const mouseLeaveHandler = useCallback(() => {
    switch (buttonBehavior) {
      case "momentary":
        setButton(false);
        break;
      case "toggle":
        break;
    }
  }, [setButton, buttonBehavior]);

  const mouseUpHandler = useCallback(() => {
    switch (buttonBehavior) {
      case "momentary":
        setButton(false);
        break;
      case "toggle":
        break;
    }
  }, [setButton, buttonBehavior]);

  return (
    <button
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseLeaveHandler}
      className={cx(styles.button, button && styles.active)}
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
