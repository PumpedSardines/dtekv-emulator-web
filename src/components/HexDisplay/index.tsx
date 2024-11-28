import styles from "./HexDisplay.module.css";
import cx from "../../utils/cx";

type HexDisplayProps = {
  value: number;
};

function HexDisplay(props: HexDisplayProps) {
  return (
    <div className={styles.hexDisplay}>
      {new Array(8).fill(0).map((_, i) => {
        const on = (props.value & (1 << i)) === 0;
        return (
          <div
            key={i}
            className={cx(styles.hexSegment, on ? styles.on : styles.off)}
          ></div>
        );
      })}
    </div>
  );
}

export default HexDisplay;
