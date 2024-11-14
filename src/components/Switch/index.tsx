import { useCallback, useState } from "react";
import cx from "../../utils/cx";
import styles from "./Switch.module.css";

type SwitchProps = {
  on: boolean;
  onClick?: () => void;
} & Omit<
  React.ComponentProps<"button">,
  "onClick" | "onMouseDown" | "onMouseUp" | "onMouseLeave"
>;

function Switch(props: SwitchProps) {
  const [isDown, setIsDown] = useState(false);
  const { on, onClick, ...rest } = props;

  const onMouseDownHandler = useCallback(() => {
    if (!isDown) {
      setIsDown(true);
      onClick?.();
    }
  }, [isDown, onClick]);

  const onMouseUpHandler = useCallback(() => {
    if (isDown) {
      setIsDown(false);
    }
  }, [isDown]);

  const onMouseLeaveHandler = useCallback(() => {
    if (isDown) {
      setIsDown(false);
    }
  }, [isDown]);

  return (
    <button
      {...rest}
      onMouseUp={onMouseUpHandler}
      onMouseDown={onMouseDownHandler}
      onMouseLeave={onMouseLeaveHandler}
      className={cx(rest.className, styles.switch)}
    >
      <div className={styles.middle}>
        <div className={cx(styles.knob, on && styles.on)}>
          <div className={styles.knobLine} />
          <div className={styles.knobLine} />
          <div className={styles.knobLine} />
        </div>
      </div>
    </button>
  );
}

export default Switch;
