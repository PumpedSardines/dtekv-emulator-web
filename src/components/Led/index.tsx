import React from "react";
import styles from "./Led.module.css";
import cx from "../../utils/cx";

type LedProps = {
  on: boolean;
};

function Led(props: LedProps) {
  return <div className={styles.root}>
    <div className={cx(styles.mid, props.on && styles.on)} />
  </div>;
}

export default React.memo(Led);
